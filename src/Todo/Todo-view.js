import React from 'react';
import Task from './Task/Task';

export default function todoRenderer({ submit, changed, text, setChangedTask, deleteTask, completed, open}) {
  return (
    <React.Fragment>
      <form className="add-form" onSubmit={ submit }>
        <input onChange={ changed } placeholder={ text.ph }/>
        <button>{ text.btn }</button>
      </form>

      <h2 className="left-align">{ text.todo }</h2>
      { open.length ?
        <ul>
          { open.map((task, index) =>
            <Task
              key={ index }
              task={ task }
              onChange={ setChangedTask }
              onDelete={ deleteTask }
            />) }
        </ul>
        : text.todoNo
      }

      <h2 className="left-align">{ text.completed }</h2>
      { completed.length ?
        <ul>
          { completed.map((task, index) =>
            <Task
              key={ index }
              task={ task }
              onChange={ setChangedTask }
              onDelete={ deleteTask }
            />) }
        </ul>
        : text.completedNo
      }
    </React.Fragment>
  )
}
