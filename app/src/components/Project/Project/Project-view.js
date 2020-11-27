import React from 'react';
import { text } from 'config/text';
import TaskModal from 'components/Modal/TaskModal';
import ProjectTitle from './ProjectTitle/ProjectTitle';
import Task from './Task/Task';


export default function projectRender (p) {

  return (
    <>
      <ProjectTitle
        projectFunctions={ p.project } showCompleted={ p.showCompleted } toggleShowCompleted={ p.toggleShowCompleted }
        isLoading={ p.isLoading }
      />

      <ul className="list-unstyled">
        { p.open.length ?
          p.open.map((task) =>
            <Task
              key={ task.id }
              task={ task }
              level={ 0 }
            />)
          : (p.completed.length ? <li><h5 className="subtle max-content ml-50">{ p.allCompleted }</h5></li> : '')
        }
        { p.showCompleted && p.completed.map((task) =>
          <Task
            key={ task.id }
            task={ task }
          />) }

        <li className="task">
          <form onSubmit={ p.submit }
            className={ 'flex-row task-content form-inline' + (p.isLoading === 'task' ? ' loader-input' : '') }>
            {/*className={ 'flex-row task-content form-inline' + (p.isLoading === 'task' ? ' loader-input' : '') }>*/}
            <i /* Just to give the right padding */ className="material-icons left v-hidden mr-11">add</i>
            <i className="material-icons left subtle">add</i>
            <div className="form-group">
              <div className="input-group mb-2">
                <input
                  onChange={ p.taskNameChange } className="invisible f-100"
                  placeholder={ p.addTaskPh } required
                  disabled={ p.isLoading === 'task' }
                  autoComplete="off" /*ref={ inputElement }*/
                />
              </div>
            </div>
          </form>
        </li>
      </ul>

      {
        // <TaskModal
        //   trigger={ {
        //     className: 'btn-floating btn-large new-task fixed-action-btn subtle-bg',
        //     text: <i className="material-icons">add</i>
        //   } }
        //   task={ {} }
        //   modalOpen={ p.modalOpen }
        //   setModalOpen={ p.setModalOpen }
        // />
      }
    </>
  );
}
