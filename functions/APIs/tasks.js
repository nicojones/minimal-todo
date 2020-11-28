const { db } = require('../util/firebase');

exports.addTask = (request, response) => {
  const projectId = request.params.projectId;

  if ((request.body.name || '').trim() === '') {
    return response.status(400).json({ message: 'Task Name not be empty' });
  }
  if ((request.body.name || '').length > 200) {
    return response.status(400).json({ message: 'Name cannot be more than 200 chars' });
  }
  if (!request.body.projectId) {
    return response.status(400).json({ message: 'Tasks must have a project ID.'});
    // return response.status(400).json({ message: 'Tasks must have a project ID. Try deleting the task and making it again'})
  }

  const newTodoItem = {
    name: request.body.name,
    _name_lower: request.body.name.toLowerCase(),
    description: request.body.description,
    expanded: request.body.expanded || false,
    checked: request.body.checked || false,
    level: request.body.level || 0,
    parentId: request.body.parentId || null,
    projectId: request.body.projectId || null,
    priority: request.body.priority || 0,
    dueDate: request.body.dueDate || null,
    dueAlert: request.body.dueAlert || request.body.dueDate || null,
    timestamp: new Date()
  };

  db
    .collection(`/projects/${ projectId }/tasks`)
    .add(newTodoItem)
    .then((doc) => {
      return response.json({
        message: `New Task created`,
        taskId: doc.id
      });
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: 'Something went wrong. See node.js console for details' });
    });
};

exports.deleteTask = (request, response) => {

  const projectId = request.params.projectId;
  const taskId = request.params.taskId;

  db
    .doc(`/projects/${ projectId }/tasks/${ taskId }`)
    .delete()
    .then(() => {
      response.json({ message: 'Delete successful' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

exports.updateTask = (request, response) => {
  const projectId = request.params.projectId;
  const taskId = request.params.taskId;

  request.body._name_lower = request.body.name.toLowerCase();

  let document = db.doc(`/projects/${ projectId }/tasks/${ taskId }`);
  document.update(request.body)
    // .then((doc) => {
    //   response.json({
    //     message: `Task ${ request.body.name } updated successfully`,
    //   });
    // })
    .catch((error) => {
      if (error.code === 5) {
        response.status(404).json({ error: 'Not Found' });
      }
      console.error(error);
      return response.status(500).json({
        error: error.code
      });
    });
};
