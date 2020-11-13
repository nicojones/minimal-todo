import React from 'react';
import './_task.scss';

function Task ({ task, onChange, onDelete }) {

  function changed () {
    task.checked = !task.checked;
    onChange(Math.random());
  }

  return (
    <li className={ task.checked ? 'checked' : 'unchecked' }>
      <label title={task.id}>
        <input type="checkbox" checked={ task.checked } onChange={ changed }/>
        { task.name }
        <button className="delete danger" onClick={() => onDelete(task.id)}>&times;</button>
      </label>
    </li>
  );
}

export default Task;
