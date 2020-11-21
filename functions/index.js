const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');

app.use(cors());

const auth = require('./util/auth');

const { canAccessProject } = require('./APIs/canAccess');

const {
  addTask,
  deleteTask,
  updateTask
} = require('./APIs/todos');

const {
  addProject,
  deleteProject,
  updateProject
} = require('./APIs/projects');

const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require('./APIs/users');

// ProjectList
app.post('/project', auth, addProject);
app.delete('/project/:projectId', auth, canAccessProject, deleteProject);
app.put('/project/:projectId', auth, canAccessProject, updateProject);
// Todos
app.post('/project/:projectId/task', auth, canAccessProject, addTask);
app.delete('/project/:projectId/task/:taskId', auth, canAccessProject, deleteTask);
app.put('/project/:projectId/task/:taskId', auth, canAccessProject, updateTask);

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.post('/user', auth, updateUserDetails);
app.get('/user', auth, getUserDetail);

exports.api = functions.https.onRequest(app);
