import Modal from './Modal';
import React, { useContext, useEffect, useState } from 'react';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'config/text';
import taskService from 'services/taskService';
import { ProjectContext } from 'TodoApp';


function TaskModal ({ trigger, task, modalOpen, setModalOpen }) {

  const [loading, setLoading] = useState(false);
  const [subtaskName, setSubtaskName] = useState('');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [taskName, setTaskName] = useState(task.name || '');
  const [taskDesc, setTaskDesc] = useState(task.description || '');

  const project = useContext(ProjectContext);

  useEffect(() => {
    setTaskName(task.name || '');
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || '');
  }, [task]);

  async function saveTask (e) {
    e.preventDefault();

    setLoading(true);

    await taskService.updateTask({ ...task, name: taskName, description: taskDesc });

    setLoading(false);

    setModalOpen(false);
  }

  async function toggleSubtask (subtask) {
    subtask.checked = !subtask.checked;
    await taskService.toggleTask(subtask);
  }

  async function saveSubtask (e) {
    e.preventDefault();

    await taskService.addTask(createTaskObject({
      name: subtaskName, parentId: task.id, level: task.level + 1, projectId: project.id
    }));

    e.target[0].value = '';
  }

  return (
    <>
      <button className={ trigger.className } onClick={ () => setModalOpen(true) }>{ trigger.text }</button>
      <Modal
        modalOpen={ modalOpen }
        loading={ loading }
        onAccept={ saveTask }
        onCancel={ () => setModalOpen(false) }
        okButton={ text.task.save + ' <i class="material-icons right">save</i>' }
        cancelButton={ text.task.discard + ' <i class="material-icons right">cancel</i>' }
      >
        <h6 className="subtle mb-15 mt-5">{ project.name }</h6>
        <form onSubmit={ saveTask }>
          <div>
            <label>{ text.task.name }</label>
            <input
              value={ taskName } required minLength={ 3 }
              placeholder={ text.task.addPh }
              onChange={ (e) => setTaskName(e.target.value) }
            />
          </div>
          <div>
            <label>{ text.task.notes }</label>
            <input
              value={ taskDesc }
              className="materialize-textarea"
              placeholder={ text.task.notesPh }
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
          <li key="new-subtask">
            <form onSubmit={ saveSubtask }>
              <label>{ text.subtasks }</label>
              <input
                onChange={ (e) => setSubtaskName(e.target.value) }
                placeholder={ text.task.addSubtaskPh }
                className="input-field"
                required minLength={ 3 }
              />
            </form>
          </li>
        </ul>
      </Modal>
    </>
  );
}

export default TaskModal;
