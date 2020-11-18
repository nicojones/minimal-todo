import { text } from 'text';
import React, { useState } from 'react';
import taskService from '../../../services/taskService';

function Subtask ({ extraClass, task, setSubtasks }) {

  const [subtaskName, setSubtaskName] = useState('');
  const [addSubtaskInput, setAddSubtaskInput] = useState(false);

  function saveSubtask (e) {
    e.preventDefault();
    e.target[0].value = '';
    setAddSubtaskInput(false);

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
    <ul className={ 'list-unstyled flex-column ' + extraClass }>
      {
        (task.subtasks || []).map((sub) =>
          <li key={ sub.key } title={ sub.timestamp } className="block">
            <label className="left">
              <input
                type="checkbox" checked={ sub.checked }
                id={ sub.key } className="material-cb"
                onChange={ () => toggleSubtask(sub) }
              />
              <div/>
            </label>
            <span className="left">{ sub.name }</span>
          </li>
        )
      }
      <li key="new-subtask">
        {
          addSubtaskInput
            ?
            <form onSubmit={ saveSubtask }>
              <input
                onChange={ (e) => setSubtaskName(e.target.value) }
                placeholder={ text.addSubtaskPh }
                autoFocus={ true }
                className="input-field invisible"
              />
            </form>
            :
            <button className="btn-flat subtle" onClick={ () => setAddSubtaskInput(true) }>
              <i className="material-icons left">add</i>
              { text.addSubtaskBtn }
            </button>
        }
      </li>
    </ul>
  );
}

export default Subtask;
