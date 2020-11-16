import React from 'react';
import Task from './Task/Task';

export default function todoRenderer ({ submit, changed, text, saveTask, deleteTask, completed, open }) {
  return (
    <React.Fragment>
      <h1>{ text.title }</h1>
      <form className="form-inline" onSubmit={ submit }>
        <div className="form-group">
          <div className="input-group mb-2">
            <label htmlFor="todo-name" className="sr-only">{ text.ph }</label>
            <input onChange={ changed } className="form-control" id="todo-name" placeholder={ text.ph } required/>
            <div className="input-group-append">
              <button type="submit" className=" input-group-text btn btn-primary mb-2">{ text.btn }</button>
            </div>
          </div>
        </div>
      </form>

      <h2 className="left-align">{ text.uncompleted }</h2>
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

      <h2 className="left-align">{ text.completed }</h2>
      { completed.length ?
        <ul className="list-unstyled">
          { completed.map((task, index) =>
            <Task
              key={ index }
              task={ task }
              saveTask={ saveTask }
              onDelete={ deleteTask }
            />) }
        </ul>
        : text.completedNo
      }
    </React.Fragment>
  );
}
