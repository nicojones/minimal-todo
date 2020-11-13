import { useState, useEffect } from 'react';
import './_todo.scss';
import todoRenderer from './Todo-view';

function Todo () {

  const [tasks, setTasks] = useState(localStorage._tasks_ ? JSON.parse(localStorage._tasks_) : []);
  const setChangedTask = useState(null)[1];

  const open = tasks.filter((task) => !task.checked);
  const completed = tasks.filter((task) => !!task.checked);

  let taskName = '';
  let input;

  const text = {
    ph: 'Enter task name and press enter',
    btn: 'Add task',
    todo: 'To-Do',
    todoNo: 'All tasks completed!',
    completed: 'Completed',
    completedNo: 'No completed tasks'
  };

  useEffect(() => {
    localStorage._tasks_ = JSON.stringify(tasks);
  }, [tasks]);

  function submit (e) {
    e.preventDefault();

    const newTasks = [...tasks, {
      name: taskName,
      checked: false,
      id: new Date()
    }];

    setTasks(newTasks);

    input.target.value = '';
  }

  function changed (e) {
    input = input || e;
    taskName = e.target.value;
  }

  function deleteTask (id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index >= 0) {
      tasks.splice(index, 1);
      setTasks([...tasks]);
    }
  }

  return todoRenderer({open,completed, deleteTask, submit, changed, text, setChangedTask});
}

export default Todo;
