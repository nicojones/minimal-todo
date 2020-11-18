export const text = {
  loading: 'Loading app...',
  noListName: '<no name>',
  addPh: 'Quick-add a task...',
  addSubtaskPh: 'Add a subtask to this task',
  addSubtaskBtn: 'Add a subtask',
  subtasks: 'Subtasks',
  // btn: 'Add task',
  // title: 'MyTodo List',
  // uncompleted: 'My tasks',
  allTasksCompleted: () => {
    const incomplete = [
      '😁 All tasks completed!',
      'Now that\'s what I call a clean list 🥳',
      'Wow, such empty 👏',
      'Finitto? Go for a cappucino ☕️',
      'All tasks done, time for a break 🏖',
      'So productive. I\'m impressed 😎'
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
  addProject: '+ Add a new project',
  addProjectPh: 'Enter a name for a new project'

};
