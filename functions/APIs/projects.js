const { validateProjectData } = require('../util/validators');
const { db } = require('../util/firebase');
const { deleteCollection } = require('../util/deleteCollection');


exports.addProject = (request, response) => {
  if ((request.body.name || '').trim() === '') {
    return response.status(400).json({ message: 'Project Name not be empty' });
  }
  if ((request.body.name || '').length > 200) {
    return response.status(400).json({ message: 'Project Name cannot be more than 200 chars' });
  }

  const newProject = {
    // User fields
    name: request.body.name,
    color: request.body.color,
    sort: request.body.sort || '',

    // System fields
    timestamp: new Date(),
    _uids: [request.user.uid],
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
    .then(async (projDoc) => {
      const userIds = projDoc.data()._uids.filter((uid) => uid !== request.user.uid);
      projectName = projDoc.data().name;

      if (userIds.length) {
        // Still some users -> UPDATE
        return db
          .doc(`/projects/${ projectId }`)
          .update({
            _uids: userIds,
            shared: userIds.length > 1
          });
      } else {
        // No more users -> DELETE
        // const firebase = require('firebase');
        // const config = require('../util/config');
        // firebase.initializeApp(config);
        // return firebase.functions().httpsCallable('recursiveDelete')({ path: `/projects/${ projectId }` });

        // return db.doc(`/projects/${ projectId }`).delete();
        await deleteCollection(db, `/projects/${ projectId }/tasks`, 100);
        return db.doc(`/projects/${ projectId }`).delete();
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

exports.deleteProjectTasks = (request, response) => {
  const projectId = request.params.projectId;
  // Get a new write batch
  const batch = db.batch();

  db.collection(`/projects/${ projectId }/tasks`).listDocuments().then(val => {
    val.map((val) => {
      batch.delete(val);
    });

    batch.commit().then(() => {
      response.status(200).json({ message: 'Tasks deleted' });
    });
  });

};

exports.updateProject = (request, response) => {
  const projectId = request.params.projectId;

  // !!! Not all fields are editable!
  const project = {
    name: request.body.name || '',
    color: request.body.color || '#333',
    sort: request.body.sort || '',
    showCompleted: request.body.showCompleted || false
  };

  const errors = validateProjectData(project);

  if (!errors.valid) {
    return response.status(400).json({ error: errors.errors });
  }

  let document = db.doc(`/projects/${ projectId }`);
  document.update(project)
    // .then((doc) => {
    //   response.json({ message: `Project ${ request.body.name } updated successfully` });
    // })
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
        .get();
    })
    .then((doc) => {
      const userIds = doc.data()._uids;
      userIds.push(userId);
      return db
        .doc(`/projects/${ projectId }`)
        .update({
          _uids: userIds,
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
