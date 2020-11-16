import { useState, useEffect } from 'react';
import './_todo.scss';
import todoRenderer from './Todo-view';
import { db } from '../../services/firebase';

function Todo () {

  const [tasks, setTasks] = useState([]);


  const open = tasks.filter((task) => !task.checked);
  const completed = tasks.filter((task) => !!task.checked);

  let taskName = '';
  let input;

  const text = {
    ph: 'Enter task name and press enter',
    btn: 'Add task',
    title: 'My Todo List',
    uncompleted: 'My tasks',
    uncompletedNo: 'All tasks completed!',
    completed: 'Completed',
    completedNo: 'No completed tasks'
  };

  useEffect(() => {
    try {
      console.log('recalled, resubscribed');
      db.ref('todos').on('value', (snapshot) => {
        const tasks = [];
        snapshot.forEach((snap) => {
          tasks.push({
            ...snap.val(),
            key: snap.key
          });
        });
        console.log('loaded tasks from WS! ', tasks)
        setTasks(tasks);
      });
    } catch (error) {
      console.error(error.message);
      // this.setState({ readError: error.message });
    }
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  // useEffect(() => {
  //   console.log('tasks rerendered???', tasks);
  // }, [tasks])

  async function submit (e) {
    e.preventDefault();

    try {
      await db.ref('todos').push({
        name: taskName,
        checked: false,
        timestamp: new Date(),
        subtasks: [], // will not be saved in the DB. here just for reference...
        notes: ''
      });
      // this.setState({ content: '' });
    } catch (error) {
      // this.setState({ writeError: error.message });
    }

    input.target.value = '';
  }

  function changed (e) {
    input = input || e;
    taskName = e.target.value;
  }

  async function saveTask (task) {
    await db.ref(`todos/${ task.key }`).update(task);
  }

  async function deleteTask (task) {
    const index = tasks.findIndex((_task) => _task.key === task.key);
    if (index >= 0) {
      await db.ref(`todos/${ task.key }`).remove(() => {
        console.log(`"${ task.name }" was removed!`);
      });
    }
  }

  return todoRenderer({
    open,
    completed,
    deleteTask,
    submit,
    changed,
    text,
    saveTask
  });
}

export default Todo;
