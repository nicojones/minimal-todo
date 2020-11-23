const dateToday = new Date().toISOString().slice(0, 10);

export const text = {
  gotoApp: 'Open app',
  loading: 'Loading app...',
  noListName: 'New Project ' + dateToday,
  addPh: 'Quick-add a task...',
  addSubtaskPh: 'Add subtasks to this task',
  addSubtaskBtn: 'Add a subtask',
  subtasks: 'Subtasks',
  sharedProject: 'This project is shared',
  subtaskStatus: '( Completed / Pending )',
  deleteTask: 'Delete task and its subtasks? Can\'t be undone',
  // btn: 'Add task',
  // title: 'MyTodo List',
  // uncompleted: 'My tasks',
  allTasksCompleted: () => {
    const incomplete = [
      '😁 All tasks completed!',
      'Now that\'s what I call a clean list 🥳',
      'Wow, such empty 👏',
      'Finitto? Go for a cappuccino ☕️',
      'All tasks done, time for a break 🏖',
      'So productive. I\'m impressed 😎',
      'Make a Todolist: Done ✅',
      'I am Finnish 🇫🇮 with all tasks.'
    ];
    return incomplete[Math.floor(Math.random() * incomplete.length)];
  },
  completed: 'Completed',
  completedNo: 'No completed tasks',
  showCompleted: 'Show completed tasks',
  hideCompleted: 'Hide completed tasks',

  saveTask: 'Save',
  discardTask: 'Cancel changes',

  notes: 'Notes',
  notesPh: 'An optional description always helps',

  projects: 'Projects',
  addProject: 'Add a new project',
  addProjectPh: 'Enter a name for a new project',
  deleteProject: 'Delete this project and all the tasks? (cannot be undone)',

  loggedInAs: (name) => `Logged in as ${ name }.`,

  login: {
    login: 'Log in',
    signup: 'Sign up',
    logout: 'Log out',
    noAccount: 'Don\'t have an account?',
    yesAccount: 'Already a user?',
    error: 'Invalid credentials',
    success: 'Welcome Back!',
    signupSuccess: 'Account created! Logging you in...'
  },

};
