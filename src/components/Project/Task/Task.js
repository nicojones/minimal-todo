import React, { useEffect, useState } from 'react';
import './_task.scss';
import TaskModal from 'components/Modal/TaskModal';
import Subtask from './Subtask';
import { text } from 'text';
import taskService from '../../../services/taskService';

function Task ({ task, onDelete }) {

  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [mainCheckDisabled, setMainCheckDisabled] = useState(!!subtasks.find((s) => s.checked === false));
  const [expandedTask, setExpandedTask] = useState(mainCheckDisabled);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMainCheckDisabled(!!task.subtasks.find((s) => s.checked === false))
  }, [task.subtasks])

  async function toggleCompleted (task) {
    task.checked = !task.checked;
    await taskService.updateTask(task);
  }

  return (
    <li className={ (task.checked ? 'done' : '') + ' parent-hover task' } title={ task.timestamp }>
      <div className="task-content">
        <label className="left">
          <input
            type="checkbox"
            disabled={ mainCheckDisabled }
            checked={ task.checked }
            onChange={ () => toggleCompleted(task) }
          />
          <span> </span>
        </label>
        <button className={ 'btn-invisible task-name ' + (task.checked ? '' : '') } onClick={ () => setModalOpen(true) }
        >{ task.name }</button>

        <span className="right">
          <button
            className="child-hover btn-subtle ml-5 material-icons right"
            onClick={ () => onDelete(task) }
          >delete
          </button>
          <button
            className="child-hover toggle-expand btn-subtle ml-5 material-icons right"
            onClick={ () => setExpandedTask(!expandedTask) }
          >add
          </button>
          <TaskModal
            trigger={ {
              className: 'child-hover btn-subtle ml-5 material-icons right',
              text: 'edit'
            } } task={ { ...task } }
            modalOpen={ modalOpen }
            setModalOpen={ setModalOpen }
          />
        </span>
      </div>
      {
        expandedTask &&
        <>
          {
            task.description &&
            <div className="ml-50">
              <p><span className="subtle">{ text.notes }:</span> { task.description }</p>
            </div>
          }
          <Subtask extraClass={ 'ml-50' } setSubtasks={ setSubtasks } subtasks={ subtasks } task={ task }/>
        </>
      }
    </li>
  );
}

export default Task;
