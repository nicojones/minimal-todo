import Modal from './Modal';
import React, { useContext, useEffect, useState } from 'react';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'config/text';
import taskService from 'services/taskService';
import { ProjectContext } from 'TodoApp';


function TaskModal ({ trigger, task, modalOpen, setModalOpen }) {

  const [loading, setLoading] = useState(false);
  const [loadingST, setLoadingST] = useState(false);
  const [subtaskName, setSubtaskName] = useState('');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [taskName, setTaskName] = useState(task.name || '');
  const [taskDesc, setTaskDesc] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 0);

  const project = useContext(ProjectContext);

  useEffect(() => {
    setTaskName(task.name || '');
    setSubtasks(task.subtasks || []);
    setTaskDesc(task.description || '');
    setPriority(task.priority || 0);
  }, [task]);

  async function saveTask (e) {
    e.preventDefault();

    setLoading(true);

    await taskService.updateTask({
      ...task,
      name: taskName,
      priority: priority,
      description: taskDesc
    });

    setLoading(false);

    setModalOpen(false);
  }

  async function toggleSubtask (subtask) {
    subtask.checked = !subtask.checked;
    await taskService.toggleTask(subtask);
  }

  async function saveSubtask (e) {
    e.preventDefault();
    setLoadingST(true);
    await taskService.addTask(createTaskObject({
      name: subtaskName,
      parentId: task.id,
      level: task.level + 1,
      projectId: project.id
    }));

    setLoadingST(false);
    setSubtaskName('');
  }

  return (
    <>
      { trigger &&
        <button className={ trigger.className } onClick={ () => setModalOpen(true) }>{ trigger.text }</button>
      }
      <Modal
        modalOpen={ modalOpen }
        loading={ loading }
        onAccept={ saveTask }
        onCancel={ () => setModalOpen(false) }
        okButton={ '<i class="material-icons right">save</i>' }
        cancelButton={ '<i class="material-icons right">close</i>' }
      >
        {/*<h6 className="subtle mb-15 mt-5">{ project.name }</h6>*/ }
        <form onSubmit={ saveTask }>
          <div>
            {/*<label>{ text.task.name }</label>*/ }
            <input
              value={ taskName } required minLength={ 3 }
              placeholder={ text.task.name }
              onChange={ (e) => setTaskName(e.target.value) }
            />
          </div>
          <div>
            {/*<label>{ text.task.notes }</label>*/ }
            <input
              value={ taskDesc }
              className="materialize-textarea"
              placeholder={ text.task.notes }
              onChange={ (e) => setTaskDesc(e.target.value) }
            />
          </div>
          <div>
            <label>{ text.task.prio._ }</label>
            <div className="flex-row">
              <button
                className={ 'btn-invisible priority prio-0 ' + (priority === 0 && 'active') }
                onClick={ () => setPriority(0) } type="button"
              >
                <i className="material-icons">flag</i></button>
              <button
                className={ 'btn-invisible priority prio-1 ' + (priority === 1 && 'active') }
                onClick={ () => setPriority(1) } type="button"
              >
                <i className="material-icons">flag</i></button>
              <button
                className={ 'btn-invisible priority prio-2 ' + (priority === 2 && 'active') }
                onClick={ () => setPriority(2) } type="button"
              >
                <i className="material-icons">flag</i></button>
              <button
                className={ 'btn-invisible priority prio-3 ' + (priority === 3 && 'active') }
                onClick={ () => setPriority(3) } type="button"
              >
                <i className="material-icons">flag</i></button>
            </div>
          </div>
        </form>

        <ul className="list-unstyled flex-column">
          <li key="new-subtask" className={ loadingST ? ' loader-input' : '' }>
            <form onSubmit={ saveSubtask } className="flex-row">
              <input
                onChange={ (e) => setSubtaskName(e.target.value) }
                placeholder={ text.task.subtasks }
                value={ subtaskName }
                className="input-field"
                required minLength={ 3 }
              />
              { subtaskName ? <button className="material-icons btn-invisible right">save</button> : '' }
            </form>
          </li>
          {
            (subtasks || []).map((sub) =>
              <li key={ sub.id } data-tip={ sub.timestamp } className="block">
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
        </ul>
      </Modal>
    </>
  );
}

export default TaskModal;
