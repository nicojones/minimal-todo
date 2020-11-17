import { useState, useEffect } from 'react';
import './_todo.scss';
import todoRenderer from 'components/Todo/Todo-view';
import { db } from 'services/firebase';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';

function Todo () {

  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);

  const open = tasks.filter((task) => !task.checked);
  const completed = tasks.filter((task) => !!task.checked);

  let taskName = '';
  let input;

  useEffect(() => {
    taskService.getTasks(setTasks);
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  async function submit (e) {
    e.preventDefault();

    await taskService.addTask(createTaskObject({ name: taskName }));

    input.target.value = '';
  }

  function changed (e) {
    input = input || e;
    taskName = e.target.value;
  }

  return todoRenderer({
    open,
    completed,
    deleteTask: (task) => taskService.deleteTask(task, tasks),
    submit,
    changed,
    saveTask: taskService.updateTask,
    showCompleted,
    setShowCompleted,
  });
}

export default Todo;
