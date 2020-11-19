import React from 'react';
import Task from 'components/Project/Task/Task';
import { text } from 'text';
import TaskModal from 'components/Modal/TaskModal';
import ProjectTitle from 'components/ProjectTitle/ProjectTitle';


export default function projectRender ({
  /*inputElement,*/ submit, changed, completed, open, showCompleted, setShowCompleted, modalOpen, setModalOpen, allCompleted, project
}) {

  return (
    <>
      <ProjectTitle project={ project } showCompleted={ showCompleted } setShowCompleted={ setShowCompleted }/>

      <ul className="list-unstyled">
        { open.length ?
          open.map((task) =>
            <Task
              key={ task.key }
              task={ task }
            />)
          : (completed.length ? <li><h5 className="subtle max-content">{ allCompleted }</h5></li> : '')
        }
        { showCompleted && completed.map((task) =>
          <Task
            key={ task.key }
            task={ task }
          />) }
      </ul>

      <form className="form-inline" onSubmit={ submit }>
        <div className="form-group">
          <div className="input-group mb-2">
            <input
              onChange={ changed } className="invisible"
              placeholder={ text.addPh } required
              autoComplete="off" /*ref={ inputElement }*/
            />
          </div>
        </div>
      </form>

      <TaskModal
        trigger={ {
          className: 'btn-floating btn-large fixed-action-btn subtle-bg',
          text: <i className="material-icons">add</i>
        } }
        task={ {} }
        modalOpen={ modalOpen }
        setModalOpen={ setModalOpen }
      />
    </>
  );
}
