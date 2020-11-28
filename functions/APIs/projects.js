const { validateProjectData } = require('../util/validators');
const { db } = require('../util/firebase');
const { deleteCollection } = require('../util/deleteCollection');

/**
 * Given a projectId and a list of userIds who have access, updates the document in batch.
 * @param projectId
 * @param userIds
 * @returns {Promise<unknown>}
 */
function updateUids (projectId, userIds) {
  const batch = db.batch();

  return new Promise((resolve, reject) => {
    // Project updated, now batch update the tasks:
    return db
      .collection(`/projects/${ projectId }/tasks`)
      .listDocuments()
      .then((val) => {
        val.map((val) => {
          // Update each task with the correct user ids!
          batch.update(val, { _uids: userIds });
        });

        resolve(batch.commit());
      }).catch(reject);
  });
}

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
  let userIds;

  db
    .doc(`/projects/${ projectId }`)
    .get()
    .then(async (projDoc) => {
      userIds = projDoc.data()._uids.filter((uid) => uid !== request.user.uid);
      projectName = projDoc.data().name;

      if (userIds.length) {
        // Still some users -> UPDATE
        return db
          .doc(`/projects/${ projectId }`)
          .update({
            _uids: userIds,
            shared: userIds.length > 1
          }).then(() => {
            return updateUids(projectId, userIds);
          });
      } else {
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

  try {

    db
      .collection(`/projects/${ projectId }/tasks`)
      .listDocuments()
      .then(val => {
        val.map((val) => {
          batch.delete(val);
          // batch.update(val, { newValue: 3 });
        });

        return batch.commit();
      }).then(() => {
      response.status(200).json({ message: 'Tasks deleted' });
    })
      .catch(() => {
        response.status(500).json({ message: 'Error on catch' });
      });
  } catch (e) {
    console.error(e);
    response.status(500).json({ message: 'Server error' });
  }

};

exports.updateProject = (request, response) => {
  const projectId = request.params.projectId;

  try {

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
    document
      .update(project)
      .then(() => {
        response.json({ message: `Project ${ request.body.name } updated successfully` });
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({
          error: error.code
        });
      });
  } catch (e) {
    return response.status(500).json({
      message: e.message
    });
  }
};

exports.addUserToProject = (request, response) => {
  const projectId = request.params.projectId;
  const username = request.body.username;
  const batch = db.batch();

  let userId; // current user
  let userIds = []; //

  // First check if the ID is valid:
  db
    .doc(`/users/${ username }`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        response.status(404).json({ error: `User ${ userId } does not exist` });
      }
      userId = doc.data().userId;

      const project = request.app.get('project');
      userIds = project._uids;
      userIds.push(userId);
      return db
        .doc(`/projects/${ projectId }`)
        .update({
          _uids: userIds,
          shared: userIds.length > 1
        });
    })
    .then(() => {
      // Project updated, now batch update the tasks:
      return updateUids(projectId, userIds);
    })
    .then(() => {
      response.json({ message: `Users added successfully` });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        error: error.code
      });
    });
};
