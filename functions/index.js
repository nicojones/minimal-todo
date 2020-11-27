const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');

app.use(cors());

const auth = require('./util/auth');
const { searchUserByEmail } = require('./APIs/users');

const { addUserToProject } = require('./APIs/projects');

const { canAccessProject } = require('./APIs/canAccess');

const {
  addTask,
  deleteTask,
  updateTask
} = require('./APIs/tasks');

const {
  addProject,
  deleteProject,
  updateProject
} = require('./APIs/projects');

const {
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require('./APIs/usersAuth');

// ProjectList
app.post('/project', auth, addProject);
app.delete('/project/:projectId', auth, canAccessProject, deleteProject);
app.put('/project/:projectId', auth, canAccessProject, updateProject);
app.post('/project/:projectId/join', auth, canAccessProject, addUserToProject);
// Todos
app.post('/project/:projectId/task', auth, canAccessProject, addTask);
app.delete('/project/:projectId/task/:taskId', auth, canAccessProject, deleteTask);
app.put('/project/:projectId/task/:taskId', auth, canAccessProject, updateTask);

// User functions
app.post('/user/search', auth, searchUserByEmail);

// Users Auth functions
// app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.post('/user', auth, updateUserDetails);
app.get('/user', auth, getUserDetail);

exports.api = functions.https.onRequest(app);
