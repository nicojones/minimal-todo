import React from 'react';
import Task from 'components/Todo/Task/Task';
import { text } from 'text';
import TaskModal from 'components/Modal/TaskModal';
import ListTitle from 'components/ListTitle/ListTitle';


export default function todoRenderer ({
  submit, changed, deleteTask, completed, open, showCompleted, setShowCompleted, modalOpen, setModalOpen, allCompleted, list
}) {

  return (
    <>
      <ListTitle list={ list }/>
      { open.length ?
        <ul className="list-unstyled">
          { open.map((task, index) =>
            <Task
              key={ index }
              task={ task }
              onDelete={ deleteTask }
            />) }
        </ul>
        : <h4 className="left subtle center-align">{ allCompleted }</h4>
      }

      <form className="form-inline" onSubmit={ submit }>
        <div className="form-group">
          <div className="input-group mb-2">
            <input
              onChange={ changed } className="invisible"
              placeholder={ text.addPh } required
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>
      </form>

      { completed.length ?
        (
          showCompleted
            ?
            <>
              <hr/>
              <button className="btn-flat" onClick={ () => setShowCompleted(false) }>{ text.hideCompleted }</button>
              <ul className="list-unstyled completed">
                { completed.map((task, index) =>
                  <Task
                    key={ index }
                    task={ task }
                    onDelete={ deleteTask }
                  />) }
              </ul>
            </>
            :
            <>
              <hr/>
              <button className="btn-flat" onClick={ () => setShowCompleted(true) }>{ text.showCompleted }</button>
            </>
        )
        : <h5 className="left subtle center-align">{ text.completedNo }</h5>
      }

      <TaskModal
        trigger={ {
          className: 'btn-floating btn-large green fixed-action-btn',
          text: <i className="material-icons">add</i>
        } }
        task={ {} }
        modalOpen={ modalOpen }
        setModalOpen={ setModalOpen }
      />
    </>
  );
}
