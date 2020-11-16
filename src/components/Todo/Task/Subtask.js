import React, { useState } from 'react';
import './_task.scss';

function Subtask ({setSubtasks, task }) {

  const [subtaskName, setSubtaskName] = useState('');

  function toggleSubtask (subtask) {
    subtask.checked = !subtask.checked;
    setSubtasks([...task.subtasks]);
  }

  function saveSubtask (e) {
    e.preventDefault();

    setSubtasks([
      ...task.subtasks,
      {
        key: Math.random(),
        timestamp: new Date(),
        name: subtaskName,
        checked: false
      }
    ]);
    e.target[0].value = '';
  }

  return (
    <React.Fragment>

      <ul className="subtasks list-unstyled">
        {
          (task.subtasks || []).map((sub) =>
            <li key={ sub.key } title={ sub.timestamp }>
              <div className="input-group">
                <label className="input-group-prepend">
                  <div className="input-group-text">
                    <input
                      type="checkbox" checked={ sub.checked }
                      id={ sub.key }
                      onChange={ () => toggleSubtask(sub) }
                    />
                  </div>
                  { sub.name }
                </label>
              </div>
            </li>
          )
        }
        <li key="new-subtask">
          <form onSubmit={ saveSubtask }><input onChange={ (e) => setSubtaskName(e.target.value)}/></form>
        </li>
      </ul>
    </React.Fragment>
  );
}

export default Subtask;
