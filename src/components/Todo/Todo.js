import { useState, useEffect } from 'react';
import './_todo.scss';
import todoRenderer from 'components/Todo/Todo-view';
import { db } from 'services/firebase';
import createTaskObject from 'functions/createTaskObject';

function Todo () {

  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const open = tasks.filter((task) => !task.checked);
  const completed = tasks.filter((task) => !!task.checked);

  let taskName = '';
  let input;

  useEffect(() => {
    try {
      db.ref('todos').on('value', (snapshot) => {
        const tasks = [];
        snapshot.forEach((snap) => {
          tasks.push({
            ...snap.val(),
            key: snap.key
          });
        });
        setTasks(tasks);
      });
    } catch (error) {
      console.error(error.message);
      // this.setState({ readError: error.message });
    }
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  async function submit (e) {
    e.preventDefault();

    try {
      await db.ref('todos').push(createTaskObject({ name: taskName }));
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
    saveTask,
    showCompleted,
    setShowCompleted,
  });
}

export default Todo;
