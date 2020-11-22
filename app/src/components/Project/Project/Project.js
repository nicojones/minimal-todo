import { useEffect, useMemo, useState } from 'react';
import './_project.scss';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'text';
import projectRender from './Project-view';
import projectService from '../../../services/projectService';

function Project ({ project, projectTasks }) {

  const [isLoading, setIsLoading] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name || text.noListName);
  const [editListName, setEditListName] = useState(false);

  const open = projectTasks.filter((task) => !task.checked);
  const completed = projectTasks.filter((task) => !!task.checked);

  // const inputElement = useRef(null);

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted()
  }, [ open.length ]);

  let taskName = '';

  useEffect(() => {
    setProjectName(project.name);
  }, [project.name])

  async function submit (e) {
    e.preventDefault();
    setIsLoading('task');
    // inputElement.current && (inputElement.current.target.value = '');

    await taskService.addTask(project.id, createTaskObject({ name: taskName }));
    e.target[0].value = '';
    setIsLoading('');
  }

  function taskNameChange (e) {
    taskName = e.target.value;
  }

  async function saveListName (e) {
    e.preventDefault();

    setIsLoading('name');
    await projectService.saveListName({ ...project, name: projectName });
    setEditListName(false);
    setIsLoading('');
  }

  return projectRender({
    open,
    completed,
    submit,
    taskNameChange,
    showCompleted,
    setShowCompleted,
    modalOpen,
    allCompleted,
    setModalOpen,
    isLoading,
    project: {
      projectName,
      saveListName,
      editListName,
      setEditListName,
      setProjectName
    }
  });
}

export default Project;
