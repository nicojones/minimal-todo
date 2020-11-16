import React, { useState } from 'react';
import './_task.scss';
import Subtask from './Subtask';

function Task ({ task, saveTask, onDelete }) {

  const [inputVisible, setInputVisible] = useState(false);
  const [taskName, setTaskName] = useState(task.name);

  function toggleCompleted (task) {
    task.checked = !task.checked;
    saveTask(task);
  }

  function changeInput (e) {
    setTaskName(e.target.value);
  }

  function saveTaskName (e) {
    e.preventDefault();
    task.name = taskName;
    setInputVisible(false);
    saveTask(task);
  }

  function saveSubtasks (subtasks) {
    task.subtasks = subtasks;
    saveTask(task);
  }


  console.log('rerendered TASK.js')
  return (
    <li className={ task.checked ? 'done' : '' }>
      <div className="input-group" title={ task.timestamp }>
        <label htmlFor={ task.key } className="input-group-prepend">
          <div className="input-group-text">
            <input
              type="checkbox" checked={ task.checked }
              id={ task.key }
              onChange={ () => toggleCompleted(task) }
            />
          </div>
        </label>
        {
          inputVisible
            ? <form onSubmit={ saveTaskName }><input value={ task.name } onChange={ changeInput }/></form>
            : <span
              className={ 'task-name alert mb-0 ' + (task.checked ? 'alert-success' : '_nothing_') }
              onDoubleClick={ () => setInputVisible(true) }
            >{ task.name }</span>
        }

        <label className="input-group-append">
          <button className="btn btn-sm float-right btn-danger" onClick={ () => onDelete(task) }>&times;</button>
        </label>
      </div>
      <Subtask setSubtasks={ saveSubtasks } task={ task } />
    </li>
  );
}

export default Task;
