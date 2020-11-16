import Modal from './Modal';
import React, { useEffect, useState } from 'react';
import createTaskObject from 'functions/createTaskObject';
import { db } from '../../services/firebase';
import Subtask from '../Todo/Task/Subtask';

function TaskModal ({ trigger, task }) {

  task = task || {};

  const [modalOpen, setModalOpen] = useState(false);

  const [ subtasks, setSubtasks ] = useState( task.subtasks || []);
  const [ taskName, setTaskName ] = useState(task.name || '');
  const [ taskDesc, setTaskDesc ] = useState(task.description || '');

  useEffect(() => {
    console.log('task??', task)
    setTaskName(task.name || '');
    // setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || '');
  }, [task])

  async function saveTask (task, keepOpen) {
    console.log('task?? task', task)
    try {
      console.log('task try', task.key)
      if (task.key) {
        await db.ref(`todos/${ task.key }`).update(task);
      } else {
        console.log(createTaskObject(task))
        await db.ref('todos').push(createTaskObject(task)).then((reference) => {
          task.key = reference.key;
        });
      }
      setModalOpen(!!keepOpen);
    } catch (error) {
    }
  }

  async function submit (e) {
    e.preventDefault();

    task.name = taskName;
    task.description = taskDesc;
    task.subtasks = subtasks;

    console.log(task, 'task!!!', subtasks);

    await saveTask(task, false)
  }

  async function saveSubtasks (subtasks) {
    console.log(subtasks)
    setSubtasks(subtasks);
    // await saveTask(task, true);
  }

  return (
    <Modal
      trigger={ trigger }
      modalOpen={ modalOpen }
      setModalOpen={ setModalOpen }
    >
      <form onSubmit={ submit }>
        <input value={ taskName }
          onChange={ (e) => setTaskName(e.target.value)}/>
        <textarea value={ taskDesc }
          onChange={ (e) => setTaskDesc(e.target.value)}/>
      </form>
      <Subtask setSubtasks={ saveSubtasks } task={ { subtasks } }/>
    </Modal>
  );
}

export default TaskModal;
