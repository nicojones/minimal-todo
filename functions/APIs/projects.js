const { db } = require('../util/admin');

exports.addProject = (request, response) => {
  if ((request.body.name || '').trim() === '') {
    return response.status(400).json({ message: 'Project Name not be empty' });
  }
  if ((request.body.name || '').length > 200) {
    return response.status(400).json({ message: 'Project Name cannot be more than 200 chars' });
  }

  const newProject = {
    name: request.body.name,
    timestamp: new Date().toISOString(),
    uids: [request.user.uid],
    shared: false
  };

  db
    .collection(`/projects`)
    .add(newProject)
    .then((doc) => {
      const project = {}; // doc.data();
      project.id = doc.id;

      return response.json({
        message: `New project with id ${ doc.id } created`,
        project: project
      });
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: 'Something went wrong. See node.js console for details' });
    });
};

exports.deleteProject = (request, response) => {

  const projectId = request.params.projectId;
  let projectName;

  db
    .doc(`/projects/${ projectId }`)
    .get()
    .then((projDoc) => {
      const userIds = projDoc.data().uids.filter((uid) => uid !== request.user.uid);
      projectName = projDoc.data().name;

      if (userIds.length) {
        // Still some users -> UPDATE
        return db
          .doc(`/projects/${ projectId }`)
          .update({
            uids: userIds,
            shared: userIds.length > 1
          });
      } else {
        // No more users -> DELETE
        return db
          .doc(`/projects/${ projectId }`)
          .delete();
      }
    })
    .then(() => {
      response.json({ message: `Project "${ projectName }" deleted` });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.updateProject = (request, response) => {
  const projectId = request.params.projectId;

  let document = db.doc(`/projects/${ projectId }`);
  document.update(request.body)
    .then((doc) => {
      response.json({ message: `Project ${ request.body.name } updated successfully` });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        error: error.code
      });
    });
};

exports.addUserToProject = (request, response) => {
  const projectId = request.params.projectId;
  const username = request.body.username;
  let userId;

  // First check if the ID is valid:
  db
    .doc(`/users/${ username }`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).json({ error: `User ${ userId } does not exist` });
      }
      userId = doc.data().userId;
      return db
        .doc(`/projects/${ projectId }`)
        .get()
    })
    .then((doc) => {
      const userIds = doc.data().uids;
      userIds.push(userId);
      return db
        .doc(`/projects/${ projectId }`)
        .update({
          uids: userIds,
          shared: userIds.length > 1
        });
    })
    .then((doc) => {
      response.json({ message: `Users added successfully` });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        error: error.code
      });
    });
};
