const dateToday = new Date().toISOString().slice(0, 10);

export const text = {
  gotoApp: 'Open app',
  loading: 'Loading app...',
  noListName: 'New Project ' + dateToday,

  task: {
    name: 'Name of the task',
    delete: 'Delete task and its subtasks? Can\'t be undone',
    addTaskPh: () => {
      const phs = [
        'e.g. Buy carrots',
        'e.g. Clean apartment in the morning',
        'e.g. Do some exercise',
        'Add a new task ...',
        'Create a task ...',
        'e.g. Call family',
        'e.g. Schedule interview'
      ];
      return phs[Math.floor(Math.random() * phs.length)];
    },
    addSubtaskPh: 'Add subtasks to this task',
    save: 'Save',
    discard: 'Cancel changes',
    notes: 'Notes',
    notesPh: 'An optional description always helps'
  },

  drawer: {
    inbox: {
      _: 'Inbox'
    },
    invalidDrawer: 'Invalid URL (not an actual project)'
  },
  // addSubtaskBtn: 'Add a subtask',
  // subtasks: 'Subtasks',
  sharedProject: 'This project is shared',
  subtaskStatus: '( Pending / Completed )',
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

  project: {
    s: 'Projects',
    noSelected: 'Select a project or create a new one.',
    share: 'Share Project',
    delete: {
      _: 'Delete Project',
      long: 'Delete this project and all the tasks? (cannot be undone)'
    },
    add: {
      // _: 'Add a new project',
      ph: 'Enter a name for a new project'
    }
  },

  genericError: 'An error occurred. Please see console for details',

  loggedInAs: (name) => `Logged in as ${ name }.`,

  login: {
    login: 'Log in',
    signup: 'Sign up',
    logout: 'Log out',
    noAccount: 'Don\'t have an account?',
    yesAccount: 'Already a user?',
    error: 'Invalid credentials',
    success: 'Welcome Back!',
    signupSuccess: 'Account created! Logging you in...',
    invalidPass: 'Invalid login credentials',
    invalidUser: 'No user exists for this email'
  },

};
