import { useEffect, useMemo, useState } from 'react';
import './_project.scss';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'config/text';
import projectRender from './Project-view';
import projectService from 'services/projectService';

function Project ({ project, projectKey, setProject }) {

  const [projectTasks, setProjectTasks] = useState([]);
  const [isLoading, setIsLoading] = useState('');
  const [showCompleted, setShowCompleted] = useState(project.showCompleted);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name || text.noListName);
  const [editListName, setEditListName] = useState(false);

  const open = projectTasks.filter((task) => !task.checked);
  const completed = projectTasks.filter((task) => !!task.checked);

  // const inputElement = useRef(null);

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted();
  }, [open.length]);

  const addTaskPh = useMemo(() => {
    setShowCompleted(project.showCompleted);
    return text.task.addTaskPh();
  }, [project.id]);

  let taskName = '';

  useEffect(() => {
    setProjectName(project.name);
  }, [project.name]);

  useEffect(() => {
    const unsubscribeProject = projectService.getProject(projectKey, setProject);
    const unsubscribeTasks = taskService.getTasksForProject(projectKey, setProjectTasks);

    return () => {
      unsubscribeProject && unsubscribeProject();
      unsubscribeTasks && unsubscribeTasks();
    };
  }, [projectKey]);

  async function addTask (e) {
    e.preventDefault();
    setIsLoading('task');
    console.log(createTaskObject({
      name: taskName,
      projectId: project.id
    }))
    // inputElement.current && (inputElement.current.target.value = '');

    const taskId = await taskService.addTask(createTaskObject({
      name: taskName,
      projectId: project.id
    }));
    e.target[0].value = '';
    setIsLoading('');
  }

  function taskNameChange (e) {
    taskName = e.target.value;
  }

  async function toggleShowCompleted (showCompleted) {
    setShowCompleted(showCompleted);
    await update({ showCompleted });
  }

  async function changeColor (hexColor) {
    await update({ color: hexColor });
  }

  async function saveListName (e) {
    e.preventDefault();

    setIsLoading('name');
    await update({ name: projectName });
    setEditListName(false);
    setIsLoading('');
  }

  async function update (projectPartial) {
    return await projectService.updateProject({ ...project, ...projectPartial });
  }

  return projectRender({
    open,
    completed,
    addTask,
    taskNameChange,
    showCompleted,
    toggleShowCompleted,
    modalOpen,
    allCompleted,
    setModalOpen,
    isLoading,
    addTaskPh,
    project: {
      projectName,
      saveListName,
      editListName,
      setEditListName,
      setProjectName,
      changeColor,
    }
  });
}

export default Project;
