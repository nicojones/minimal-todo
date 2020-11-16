import React from 'react';
import Task from 'components/Todo/Task/Task';
import { text } from 'text';
import TaskModal from '../Modal/TaskModal';


export default function todoRenderer ({
  submit, changed, saveTask, deleteTask, completed, open, showCompleted, setShowCompleted
}) {
  return (
    <React.Fragment>
      <form className="form-inline" onSubmit={ submit }>
        <div className="form-group">
          <div className="input-group mb-2">
            <input
              onChange={ changed } className="form-control" id="todo-name" placeholder={ text.addPh } required
              autoComplete="off"
            />
          </div>
        </div>
      </form>

      { open.length ?
        <ul className="list-unstyled">
          { open.map((task, index) =>
            <Task
              key={ index }
              task={ task }
              saveTask={ saveTask }
              onDelete={ deleteTask }
            />) }
        </ul>
        : text.uncompletedNo
      }

      { completed.length ?
        (
          showCompleted
            ?
            <React.Fragment>
              <hr/>
              <p onClick={ () => setShowCompleted(false) }>{ text.hideCompleted }</p>
              <ul className="list-unstyled completed">
                { completed.map((task, index) =>
                  <Task
                    key={ index }
                    task={ task }
                    saveTask={ saveTask }
                    onDelete={ deleteTask }
                  />) }
              </ul>
            </React.Fragment>
            :
            <React.Fragment>
              <hr/>
              <p onClick={ () => setShowCompleted(true) }>{ text.showCompleted }</p>
            </React.Fragment>
        )
        : text.completedNo
      }
      <TaskModal trigger={ { className: 'btn-floating green', text: '+' } } saveTask={saveTask} task={null}/>
    </React.Fragment>
  );
}
