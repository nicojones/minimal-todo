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
      <div className="">
        <label>
          <input
            type="checkbox"
            checked={ task.checked }
            onChange={ () => toggleCompleted(task) }
          />
          <span> </span>
        </label>
        <span className={ 'task-name ' + (task.checked ? '' : '') }>{ task.name }</span>

        <button
          className="child-hover btn-subtle ml-5"
          onClick={ () => onDelete(task) }
        >&times;</button>
        <button
          className="child-hover toggle-expand btn-subtle ml-5"
          onClick={ () => setExpandedTask(!expandedTask) }
        >more
        </button>
        <TaskModal
          trigger={ {
            className: 'child-hover btn-subtle ml-5',
            text: task.name
          } } task={ { ...task } }
        />
      </div>
      {/*{*/ }
      {/*  expandedTask*/ }
      {/*    ?*/ }
      {/*    <React.Fragment>*/ }
      {/*      <Subtask setSubtasks={ saveSubtasks } task={ task }/>*/ }
      {/*    </React.Fragment>*/ }
      {/*    : ''*/ }
      {/*}*/ }
    </li>
  );
}

export default Task;
