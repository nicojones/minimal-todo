import { ITask, SpecialProjectUrl } from "interfaces";
import { randArray } from "../functions/rand-array";

export const text = {
  appName: "Minimal Todo",
  appDesc: "A simple, clean and minimalist Todo App",
  gotoApp: "Open app",

  task: {
    done: "Completed",
    name: "Name of the task",
    tags: "#tags for this task",
    url: "http://example.com",
    deadline: "Deadline",
    projectDot: (name: string) => "Belongs to " + name,
    delete: {
      _: "Delete Task",
      confirm: (subtasks: ITask[]) => {
        if (!subtasks.length) {
          return "Delete task?";
        }
        return (
          "Delete task and its subtasks?\n\n" +
          subtasks.map((t) => t.name).join("\n")
        );
      },
      allDeleted: "Tasks deleted",
    },
    addTaskPh: () => {
      const phs = [
        "e.g. Buy carrots",
        "e.g. Clean apartment in the morning",
        "e.g. Do some exercise",
        "Add a new task ...",
        "Create a task ...",
        "e.g. Call family",
        "e.g. Schedule interview",
        "e.g. Do sport",
        "e.g. Cook something delicious",
      ];
      return randArray(phs);
    },
    subtasks: "Add a subtask",
    save: "Save Task",
    edit: "Edit Task",
    discard: "Cancel changes",
    descr: "Notes",
    notes: "More notes...",
    starred: "Star",
    prio: {
      _: "Priority",
      low: "Low priority",
      high: "High priority",
      urgent: "Urgent",
    },
    search: "Search...",
    noResults: "No results found",
  },

  drawer: {
    inbox: {
      _: "Inbox",
      tooltip: "Your open tasks",
    },
    priority: {
      _: "Priority",
      tooltip: "High priority stuff",
    },
    deadline: {
      _: "Upcoming",
      tooltip: "Upcoming tasks with deadline",
    },
    today: {
      _: "Today",
      tooltip: "This tasks have a deadline today",
    },
    invalidDrawer: "Invalid URL (not an actual project)",
  },
  // addSubtaskBtn: 'Add a subtask',
  // subtasks: 'Subtasks',
  sharedProject: {
    _: "This project is shared",
    header: "Manage users",
    results: "Search results",
    users: "Project users",
    admin: "This user is admin and cannot be deleted",
    remove: (email: string, project: string) =>
      `Remove ${email} from ${project}`,
    removeYourself: (project: string) =>
      `You will remove YOURSELF from ${project}. This can't be undone`,
    belongs:
      "This user already belongs to the project, so it can't be added again",
    addByEmail: "Add a user by entering their full email",
  },
  subtaskStatus: "( Pending / Completed )",
  // btn: 'Add task',
  // title: 'MyTodo List',
  // uncompleted: 'My tasks',
  allTasksCompleted: () => {
    const incomplete = [
      "All tasks completed!",
      "Now that's what I call a clean list",
      "Wow, such empty",
      "Finitto? Go for a cappuccino",
      "All tasks done, time for a break",
      "So productive. I'm impressed",
      "Make a Todolist: Done",
      "I am Finnish with all tasks.",
    ];
    return randArray(incomplete);
  },
  drawerTasksCompleted: {
    [SpecialProjectUrl.INBOX]: "You have no open tasks",
    [SpecialProjectUrl.PRIORITY]: "You have no high priority tasks",
  },
  completed: "Completed",
  completedNo: "No completed tasks",
  show_completed: "Show completed tasks",
  hideCompleted: "Hide completed tasks",

  project: {
    s: "Projects",
    noSelected: "Select a project or create a new one.",
    inspire: () =>
      randArray([
        "What will you accomplish?",
        "What's the next move?",
        "What shouldn't you forget?",
        "I have to ...",
      ]),
    share: "Share Project",
    noName: "My List",
    delete: {
      _: "Delete Project",
      tasks: {
        _: "Delete all tasks",
        ask: 'Delete all tasks? Type "delete" to continue:',
        confirm: "delete",
      },
      long: {
        _: 'Delete this project and all the tasks? (cannot be undone). Type "delete" to continue:',
        confirm: "delete",
      },
    },
    add: {
      // _: 'Add a new project',
      ph: "Create new project",
      u: (email: string) => `User ${email} added to project`,
    },
    remove: {
      u: (email: string) => `User ${email} removed from project`,
    },
    title: {
      _: "Click to edit title",
    },
    more: "More options",
  },

  genericError: "An error occurred. Please see console for details",

  loggedInAs: (name: string) => `Logged in as ${name}`,

  login: {
    login: "Log in",
    signup: "Sign up",
    logout: "Log out",
    noAccount: "Don't have an account?",
    yesAccount: "Already a user?",
    error: "Invalid credentials",
    success: (name: string) => `Welcome Back, ${name}`,
    signupSuccess: "Account created! Logging you in...",
    invalidPass: "Invalid Login credentials",
    invalidUser: "No user exists for this email",
    internalError: "Some other error happened",
    f: {
      email: {
        _: "Email",
        ph: "Enter your email",
      },
      password: {
        _: "Password",
        new: "Choose a password",
        ph: "Enter your password",
      },
      name: {
        _: "Name",
        ph: "What's your name?",
      },
      username: {
        _: "Username",
        ph: "Choose a username",
      },
    },
  },

  sort: {
    _: "Sort tasks",
    az: "A - Z",
    za: "Z - A",
    nf: "Newest first",
    of: "Oldest First",
    pr: "Priority",
  },

  user: {
    search: {
      _: "Search user",
      results: "Results",
    },
    email: {
      // enter: "enter an email"
    },
  },

  menu: {
    menu: "Enter FOCUS MODE",
    settings: {
      _: "Settings",
    },
  },

  landing: {
    title: "minimal todo",
    sub: "Your new productivity tool",
    feature: {
      _: "What and why?",
      todo: "Packed with all you need, with only what you need",
      write: "Don't get distracted and focus on what matters",
      calendar: "Increase your productivity and reduce stress",
      read: "Manage your time smarter, enjoy your free time calmer",
      create: "Free your mind of tasks and make space for creativity",
      explore: "Reduce procrastination, work better and get more of life",
    },
  },
};
