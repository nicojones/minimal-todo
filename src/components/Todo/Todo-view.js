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
        : <p className="left">{ text.uncompletedNo }</p>
      }

      { completed.length ?
        (
          showCompleted
            ?
            <React.Fragment>
              <hr/>
              <button className="btn-flat" onClick={ () => setShowCompleted(false) }>{ text.hideCompleted }</button>
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
              <button className="btn-flat" onClick={ () => setShowCompleted(true) }>{ text.showCompleted }</button>
            </React.Fragment>
        )
        : <p className="left">{ text.completedNo }</p>
      }

      <TaskModal
        trigger={ {
          className: 'btn-floating btn-large green fixed-action-btn',
          text: <i className="material-icons">add</i>
        } } saveTask={ saveTask } task={ {} }
      />
    </React.Fragment>
  );
}
