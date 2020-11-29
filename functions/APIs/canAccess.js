const { db } = require('../util/firebase');

function canAccessProject (request, response, next) {
  const projectId = request.params.projectId;

  if (request.body) {
    // fields which can't be edited.
    delete request.body.id;
    delete request.body.createdAt;
    delete request.body.updatedAt;
    delete request.body.timestamp;
    delete request.body._uids;
    delete request.body._name_lower;
    delete request.body.shared;
    delete request.body.subtasks;
  }

  try {

    db.doc(`/projects/${ projectId }`)
      .get()
      .then((proj) => {

        if (!proj.exists) { // Project does not exist
          return response.status(404).json({
            status: 404,
            error: `Project ${ projectId } not found`
          });
        }

        if (proj.data()._uids.indexOf(request.user.uid) === -1) { // User has no rights to access project
          return response.status(403).json({
            status: 403,
            error: 'NOT Authorized'
          });
        }

        const projectObj = proj.data();
        projectObj.id = projectId;
        request.app.set('project', projectObj);

        return next();
      }).catch(() => {

    });
  } catch (e) {
    console.error(`Error verifying Project ${ projectId } access`, e);
  }
}


function canAccessTask (request, response, next) {
  const projectId = request.params.projectId;
  const taskId = request.params.taskId;
  try {
    db.doc(`/projects/${ projectId }/tasks/${ taskId }`)
      .get()
      .then((taskDoc) => {
        if (!taskDoc.exists) {
          return response.status(404).json({
            status: 404,
            error: `Task ${ taskId } not found`
          });
        }
        return next();
      }).catch(() => {

    });
  } catch (e) {
    console.error(`Error verifying Task ${ taskId } access`, e);
  }
}

module.exports = {
  canAccessProject,
  taskExists: canAccessTask
};
