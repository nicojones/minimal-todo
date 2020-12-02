import React, { useContext, useEffect, useMemo, useState } from 'react';
import './_project.scss';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'config/text';
import projectService from 'services/projectService';
import { ProjectContext } from 'TodoApp';
import ProjectHeader from './ProjectHeader';
import Task from './Task/Task';
import NoProject from '../NoProject/NoProject';

function Project ({ setProject }) {

  const project = useContext(ProjectContext);

  const [sort, setSort] = useState(project.sort);
  const [taskName, setTaskName] = useState('');
  const [projectTasks, setProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState('yes');
  const [showCompleted, setShowCompleted] = useState(project.showCompleted);
  const [projectName, setProjectName] = useState(project.name || text.noListName);
  const [editListName, setEditListName] = useState(false);

  const open = projectTasks.filter((task) => !task.checked);
  const completed = projectTasks.filter((task) => !!task.checked);

  // const inputElement = useRef(null);

  const allCompleted = useMemo(() => {
    if (completed.length && !open.length && !showCompleted) {
      return (
        <li>
          <NoProject className="o-1" inspireText={ text.allTasksCompleted() }/>
        </li>
      );
    }
    return '';
  }, [projectTasks, showCompleted]);

  const addTaskPh = useMemo(() => {
    return text.task.addTaskPh();
  }, [project.id]);

  useEffect(() => {
    console.log('changed project id')
    setProjectName(project.name);
    setShowCompleted(project.showCompleted);
    setIsLoading('p');

    const unsubscribeTasks = taskService.getTasksForProject(project.id, sort, (tasks) => {
      setProjectTasks(tasks);
      setIsLoading('');

      if (project.id && sort !== project.sort) {
        projectService.updateProject({
          ...project,
          sort
        });
      }
    });

    return () => {
      // unsubscribeProject && unsubscribeProject();
      unsubscribeTasks && unsubscribeTasks();
    };
  }, [project.id, sort]);

  async function addTask (e) {
    e.preventDefault();
    setIsLoading('t');

    await taskService.addTask(createTaskObject({
      name: taskName,
      projectId: project.id
    }));
    setIsLoading('');
    setTaskName('');
  }

  function taskNameChange (e) {
    setTaskName(e.target.value);
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

  console.log('ALL', allCompleted);

  return (
    <>
      <div className={ isLoading === 'p' ? 'loader-input cover' : '' }>
        <ProjectHeader
          projectFunctions={ {
            setProject,
            projectName,
            setProjectName,
            saveListName,
            editListName,
            setEditListName,
            showCompleted,
            setShowCompleted,
            sort,
            setSort
          } } isLoading={ isLoading }
        />

        <ul>
          { open.map((task) =>
            <Task
              key={ task.id }
              task={ task }
              level={ 0 }
            />) }
          { showCompleted && completed.map((task) =>
            <Task
              key={ task.id }
              task={ task }
            />) }

          <li className="task">
            <form
              onSubmit={ addTask }
              className={ 'flex-row task__content form-inline' + (isLoading === 't' ? ' loader-input' : '') }
            >
              {/*className={ 'flex-row task__content form-inline' + (isLoading === 't' ? ' loader-input' : '') }>*/ }
              <i /* Just to give the right padding */ className="material-icons left v-hidden btn-p">add</i>
              <button className="btn p0">
                <i className="material-icons left subtle btn-pr">{ taskName ? 'save' : 'add' }</i>
              </button>
              <div className="form-group w-100">
                <div className="input-group mb-2">
                  <input
                    onChange={ taskNameChange } className="invisible f-100 btn-pl"
                    placeholder={ addTaskPh } required
                    value={ taskName }
                    id="add-project-task" // used also in NoProject
                    disabled={ isLoading === 't' }
                    autoComplete="off" /*ref={ inputElement }*/
                  />
                </div>
              </div>
            </form>
          </li>
          { allCompleted }
        </ul>
      </div>
    </>
  );
}

export default Project;
