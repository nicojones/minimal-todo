import React, { useState } from 'react';
import './_task.scss';
import TaskModal from 'components/Modal/TaskModal';

function Task ({ task, saveTask, onDelete }) {

  const [expandedTask, setExpandedTask] = useState(false);

  function toggleCompleted (task) {
    task.checked = !task.checked;
    saveTask(task);
  }


  return (
    <li className={ (task.checked ? 'done' : '') + ' parent-hover' } title={ task.timestamp }>
      <label className="left">
        <input
          type="checkbox"
          checked={ task.checked }
          onChange={ () => toggleCompleted(task) }
        />
        <span> </span>
      </label>
      <span className={ 'left task-name ' + (task.checked ? '' : '') }>{ task.name }</span>

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
      />
      {
        expandedTask &&
        <React.Fragment>
          <p>{ task.description }</p>
        </React.Fragment>
      }
    </li>
  );
}

export default Task;
