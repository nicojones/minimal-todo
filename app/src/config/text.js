import { randArray } from '../functions/randArray';

export const text = {
  appName: 'Minimal Todo',
  appDesc: 'A simple, clean and minimalist Todo App',
  gotoApp: 'Open app',

  task: {
    name: 'Name of the task',
    delete: {
      _: 'Delete Task',
      all: 'Delete task and its subtasks? Can\'t be undone'
    },
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
      return randArray(phs);
    },
    subtasks: 'Subtasks',
    save: 'Save Task',
    edit: 'Edit Task',
    discard: 'Cancel changes',
    notes: 'Notes',
    prio: {
      _: 'Priority',
      low: 'Low priority',
      high: 'High priority',
      urgent: 'Urgent'
    },
    search: 'Search...'
  },

  drawer: {
    inbox: {
      _: 'Inbox',
      tooltip: 'Your open tasks'
    },
    priority: {
      _: 'Priority',
      tooltip: 'High priority stuff'
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
    return randArray(incomplete);
  },
  completed: 'Completed',
  completedNo: 'No completed tasks',
  showCompleted: 'Show completed tasks',
  hideCompleted: 'Hide completed tasks',

  project: {
    s: 'Projects',
    noSelected: 'Select a project or create a new one.',
    inspire: 'What will you accomplish?',
    share: 'Share Project',
    delete: {
      _: 'Delete Project',
      tasks: 'Delete all tasks',
      long: 'Delete this project and all the tasks? (cannot be undone)'
    },
    add: {
      // _: 'Add a new project',
      ph: 'Enter a name for a new project'
    },
    title: {
      _: 'Click to edit title'
    },
    more: 'More options'
  },

  genericError: 'An error occurred. Please see console for details',

  loggedInAs: (name) => `Logged in as ${ name }`,

  login: {
    login: 'Log in',
    signup: 'Sign up',
    logout: 'Log out',
    noAccount: 'Don\'t have an account?',
    yesAccount: 'Already a user?',
    error: 'Invalid credentials',
    success: 'Welcome Back!',
    signupSuccess: 'Account created! Logging you in...',
    invalidPass: 'Invalid Login credentials',
    invalidUser: 'No user exists for this email',
    f: {
      email: {
        _: 'Email',
        ph: 'Enter your email'
      },
      password: {
        _: 'Password',
        ph: 'Enter your password'
      },
      name: {
        _: 'Name',
        ph: 'What\'s your name?'
      },
      username: {
        _: 'Username',
        ph: 'Choose a username'
      }
    }
  },

  sort: {
    _: 'Sort tasks',
    az: 'A - Z',
    za: 'Z - A',
    nf: 'Newest first',
    of: 'Oldest First',
    pr: 'Priority'
  },

  menu: {
    menu: 'Enter <i>Focus Mode</i>',
    settings: {
      _: 'Settings'
    }
  }
};
