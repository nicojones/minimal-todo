import Modal from './Modal';
import React, { useEffect, useState } from 'react';
import createTaskObject from 'functions/createTaskObject';
import { text } from '../../text';
import taskService from '../../services/taskService';

function TaskModal ({ trigger, task, modalOpen, setModalOpen }) {

  const [subtaskName, setSubtaskName] = useState('');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [taskName, setTaskName] = useState(task.name || '');
  const [taskDesc, setTaskDesc] = useState(task.description || '');

  useEffect(() => {
    setTaskName(task.name || '');
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || '');
  }, [task]);

  async function saveTask (task, keepOpen) {
    if (task.key) {
      await taskService.updateTask(task);
    } else {
      taskService.addTask(createTaskObject(task)).then((reference) => {
        task.key = reference.key;
      });
    }
    setModalOpen(!!keepOpen);
  }

  async function submit (e) {
    e.preventDefault();

    task.name = taskName;
    task.description = taskDesc;
    task.subtasks = subtasks;

    await saveTask(task, false);
  }

  function toggleSubtask (subtask) {
    subtask.checked = !subtask.checked;
    setSubtasks([...task?.subtasks]);
  }

  function saveSubtask (e) {
    e.preventDefault();

    setSubtasks([
      ...subtasks,
      {
        key: Math.random(),
        timestamp: new Date(),
        name: subtaskName,
        checked: false
      }
    ]);
    e.target[0].value = '';
  }

  async function onAccept (e) {
    await submit(e);
    setModalOpen(false);
  }

  return (
    <>
      <button className={ trigger.className } onClick={ () => setModalOpen(true) }>{ trigger.text }</button>
      <Modal
        modalOpen={ modalOpen }
        onAccept={ onAccept }
        onCancel={ () => setModalOpen(false) }
        okButton={ text.saveTask + ' <i class="material-icons right">save</i>' }
        cancelButton={ text.discardTask + ' <i class="material-icons right">cancel</i>' }
      >
        <form onSubmit={ submit }>
          <div>
            <label>Task Name</label>
            <input
              value={ taskName }
              placeholder="Enter a name for the task"
              onChange={ (e) => setTaskName(e.target.value) }
            />
          </div>
          <div>
            <label>{ text.notes }</label>
            <textarea
              value={ taskDesc }
              className="materialize-textarea"
              placeholder={ text.notesPh }
              onChange={ (e) => setTaskDesc(e.target.value) }
            />
          </div>
        </form>

        <ul className="list-unstyled flex-column">
          {
            subtasks.map((sub) =>
              <li key={ sub.key } title={ sub.timestamp } className="block">
                <label className="left">
                  <input
                    type="checkbox" checked={ sub.checked }
                    id={ sub.key }
                    onChange={ () => toggleSubtask(sub) }
                  />
                  <div/>
                </label>
                <span className="left">{ sub.name }</span>
              </li>
            )
          }
          <li key="new-subtask">
            <form onSubmit={ saveSubtask }>
              <label>{ text.subtasks }</label>
              <input
                onChange={ (e) => setSubtaskName(e.target.value) }
                placeholder={ text.addSubtaskPh }
                className="input-field"
              />
            </form>
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default TaskModal;
