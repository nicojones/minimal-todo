import Modal from './Modal';
import React, { useContext, useEffect, useState } from 'react';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'config/text';
import taskService from 'services/taskService';
import { ProjectContext } from 'TodoApp';


function TaskModal ({ trigger, task, modalOpen, setModalOpen }) {

  const [subtaskName, setSubtaskName] = useState('');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtasks, setNewSubtasks] = useState([]);
  const [taskName, setTaskName] = useState(task.name || '');
  const [taskDesc, setTaskDesc] = useState(task.description || '');

  const project = useContext(ProjectContext);

  useEffect(() => {
    setTaskName(task.name || '');
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || '');
  }, [task]);

  async function saveTask (task, keepOpen) {
    if (task.id) {
      await taskService.updateTask(project.id, task);
    } else {
      taskService.addTask(project.id, createTaskObject(task)).then((reference) => {
        task.id = reference.id;
      });
    }
    setModalOpen(!!keepOpen);
  }

  async function submit (e) {
    e.preventDefault();

    task.name = taskName;
    task.description = taskDesc;
    task.subtasks = [...subtasks, ...newSubtasks];

    await saveTask(task, false);
  }

  function toggleSubtask (subtask) {
    subtask.checked = !subtask.checked;
    setSubtasks([...task?.subtasks]);
  }

  function saveSubtask (e) {
    e.preventDefault();

    setNewSubtasks([
      ...newSubtasks,
      {
        id: Math.random(),
        timestamp: new Date(),
        name: subtaskName,
        checked: false
      }
    ]);
    setSubtaskName('');

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
        <h6 className="subtle mb-15 mt-5">{ project.name }</h6>
        <form onSubmit={ submit }>
          <div>
            <label>Task Name</label>
            <input
              value={ taskName } required minLength={ 3 }
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
            (subtasks || []).map((sub) =>
              <li key={ sub.id } title={ sub.timestamp } className="block">
                <label className="left">
                  <input
                    type="checkbox" checked={ sub.checked }
                    id={ sub.id }
                    className="material-cb"
                    onChange={ () => toggleSubtask(sub) }
                  />
                  <div/>
                </label>
                <span className="left">{ sub.name }</span>
              </li>
            )
          }
          {
            newSubtasks.map((sub) =>
              <li key={ sub.id } className="block">
                <label className="left">
                  <input type="checkbox" className="material-cb" disabled/>
                  <div/>
                </label>
                <span className="left subtle">{ sub.name }</span>
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
                required minLength={3}
              />
            </form>
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default TaskModal;
