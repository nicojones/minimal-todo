import React from 'react';
import { text } from 'config/text';
import TaskModal from 'components/Modal/TaskModal';
import ProjectTitle from './ProjectTitle/ProjectTitle';
import Task from './Task/Task';


export default function projectRender ({
  submit, taskNameChange, completed, open, showCompleted, setShowCompleted, modalOpen, setModalOpen, allCompleted, project, isLoading
}) {

  return (
    <>
      <ProjectTitle
        project={ project } showCompleted={ showCompleted } setShowCompleted={ setShowCompleted }
        isLoading={ isLoading }
      />

      <ul className="list-unstyled">
        { open.length ?
          open.map((task) =>
            <Task
              key={ task.id }
              task={ task }
            />)
          : (completed.length ? <li><h5 className="subtle max-content">{ allCompleted }</h5></li> : '')
        }
        { showCompleted && completed.map((task) =>
          <Task
            key={ task.id }
            task={ task }
          />) }

        <li className="task">
          <form onSubmit={ submit }
            className={ 'flex-row task-content form-inline' + (isLoading === 'task' ? ' loader-input' : '') }>
            <i /* Just to give the right padding */ className="material-icons left v-hidden mr-11">add</i>
            <i className="material-icons left subtle">add</i>
            <div className="form-group">
              <div className="input-group mb-2">
                <input
                  onChange={ taskNameChange } className="invisible f-100"
                  placeholder={ text.addPh } required
                  autoComplete="off" /*ref={ inputElement }*/
                />
              </div>
            </div>
          </form>
        </li>
      </ul>

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
