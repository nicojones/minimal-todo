import { text } from 'text';
import React, { useState } from 'react';
import taskService from '../../../services/taskService';

function Subtask ({ extraClass, task, setSubtasks }) {

  const [subtaskName, setSubtaskName] = useState('');

  function saveSubtask (e) {
    e.preventDefault();
    e.target[0].value = '';

    task.subtasks = [
      ...(task.subtasks || []),
      {
        key: Math.random(),
        timestamp: new Date(),
        name: subtaskName,
        checked: false
      }
    ];
    taskService.updateTask(task);
  }

  function toggleSubtask (subtask) {
    subtask.checked = !subtask.checked;
    taskService.updateTask(task);
    setSubtasks(task.subtasks);
  }

  return (
    <ul className={'list-unstyled flex-column ' + extraClass}>
      {
        (task.subtasks || []).map((sub) =>
          <li key={ sub.key } title={ sub.timestamp } className="block">
            <label className="left">
              <input
                type="checkbox" checked={ sub.checked }
                id={ sub.key }
                onChange={ () => toggleSubtask(sub) }
              />
              <span> </span>
            </label>
            <span className="left">{ sub.name }</span>
          </li>
        )
      }
      <li key="new-subtask">
        <form onSubmit={ saveSubtask }>
          <input
            onChange={ (e) => setSubtaskName(e.target.value) }
            placeholder={ text.addSubtaskPh }
            className="input-field invisible"
          />
        </form>
      </li>
    </ul>
  )
}

export default Subtask;
