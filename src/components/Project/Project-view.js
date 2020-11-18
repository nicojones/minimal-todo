import React from 'react';
import Task from 'components/Project/Task/Task';
import { text } from 'text';
import TaskModal from 'components/Modal/TaskModal';
import ProjectTitle from 'components/ProjectTitle/ProjectTitle';


export default function projectRender ({
  submit, changed, deleteTask, completed, open, showCompleted, setShowCompleted, modalOpen, setModalOpen, allCompleted, project
}) {

  return (
    <>
      <ProjectTitle project={ project } showCompleted={ showCompleted } setShowCompleted={ setShowCompleted }/>

      <ul className="list-unstyled">
        { open.length ?
          open.map((task, index) =>
            <Task
              key={ index }
              task={ task }
              onDelete={ deleteTask }
            />)
          : <li><h5 className="subtle">{ allCompleted }</h5></li>
        }
        { showCompleted && completed.map((task, index) =>
          <Task
            key={ index }
            task={ task }
            onDelete={ deleteTask }
          />) }
      </ul>

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

      <TaskModal
        trigger={ {
          className: 'btn-floating btn-large fixed-action-btn',
          text: <i className="material-icons">add</i>
        } }
        task={ {} }
        modalOpen={ modalOpen }
        setModalOpen={ setModalOpen }
      />
    </>
  );
}
