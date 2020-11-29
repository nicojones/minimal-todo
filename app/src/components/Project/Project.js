import React, { useContext, useEffect, useMemo, useState } from 'react';
import './_project.scss';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'config/text';
import projectService from 'services/projectService';
import { ProjectContext } from '../../TodoApp';
import ProjectHeader from './ProjectHeader';
import Task from './Task/Task';

function Project () {

  const project = useContext(ProjectContext);

  const [sort, setSort] = useState(project.sort);
  const [projectTasks, setProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState('yes');
  const [showCompleted, setShowCompleted] = useState(project.showCompleted);
  const [projectName, setProjectName] = useState(project.name || text.noListName);
  const [editListName, setEditListName] = useState(false);

  const open = projectTasks.filter((task) => !task.checked);
  const completed = projectTasks.filter((task) => !!task.checked);

  // const inputElement = useRef(null);

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted();
  }, [open.length]);

  const addTaskPh = useMemo(() => {
    return text.task.addTaskPh();
  }, [project.id]);

  let taskName = '';

  useEffect(() => {
    setProjectName(project.name);
    setShowCompleted(project.showCompleted);
    setIsLoading('p');

    // const unsubscribeProject = projectService.getProject(project.id, setProject);
    const unsubscribeTasks = taskService.getTasksForProject(project.id, sort, (tasks) => {
      setProjectTasks(tasks);
      setIsLoading('');
    });

    if (project.id && sort !== project.sort) {
      projectService.updateProject({ ...project, sort });
    }

    return () => {
      // unsubscribeProject && unsubscribeProject();
      unsubscribeTasks && unsubscribeTasks();
    };
  }, [project.id, sort]);

  async function addTask (e) {
    e.preventDefault();
    setIsLoading('t');
    console.log(createTaskObject({
      name: taskName,
      projectId: project.id
    }));
    // inputElement.current && (inputElement.current.target.value = '');

    await taskService.addTask(createTaskObject({
      name: taskName,
      projectId: project.id
    }));
    e.target[0].value = '';
    setIsLoading('');
  }

  function taskNameChange (e) {
    taskName = e.target.value;
  }

  async function saveListName (e) {
    e.preventDefault();

    setIsLoading('n');
    await update({ name: projectName });
    setEditListName(false);
    setIsLoading('');
  }

  async function update (projectPartial) {
    return await projectService.updateProject({ ...project, ...projectPartial });
  }

  return (
    <>
      <div className={ isLoading === 'p' ? 'loader-input cover' : '' }>
        <ProjectHeader projectFunctions={ {
          projectName, setProjectName,
          saveListName,
          editListName, setEditListName,
          showCompleted, setShowCompleted,
          sort, setSort
        } } isLoading={ isLoading }
        />

        <ul>
          { open.length ?
            open.map((task) =>
              <Task
                key={ task.id }
                task={ task }
                level={ 0 }
              />)
            : (completed.length ? <li><h5 className="subtle max-content ml-50">{ allCompleted }</h5></li> : '')
          }
          { showCompleted && completed.map((task) =>
            <Task
              key={ task.id }
              task={ task }
            />) }

          <li className="task">
            <form
              onSubmit={ addTask }
              className={ 'w-100 flex-row task-content form-inline' + (isLoading === 't' ? ' loader-input' : '') }
            >
              {/*className={ 'flex-row task-content form-inline' + (isLoading === 't' ? ' loader-input' : '') }>*/ }
              <i /* Just to give the right padding */ className="material-icons left v-hidden btn-p">add</i>
              <i className="material-icons left subtle btn-pr">add</i>
              <div className="form-group">
                <div className="input-group mb-2">
                  <input
                    onChange={ taskNameChange } className="invisible f-100"
                    placeholder={ addTaskPh } required
                    disabled={ isLoading === 't' }
                    autoComplete="off" /*ref={ inputElement }*/
                  />
                </div>
              </div>
            </form>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Project;
