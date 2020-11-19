import { useEffect, useMemo, useState } from 'react';
import './_project.scss';
import projectRender from 'components/Project/Project-view';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'text';

function Project ({ project }) {

  const [showCompleted, setShowCompleted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(project.name || text.noListName);
  const [editListName, setEditListName] = useState(false);

  const open = (project.tasks || []).filter((task) => !task.checked);
  const completed = (project.tasks || []).filter((task) => !!task.checked);

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
    e.target[0].value = '';
    // inputElement.current && (inputElement.current.target.value = '');

    await taskService.addTask(createTaskObject({ name: taskName }));
  }

  function changed (e) {
    taskName = e.target.value;
  }

  async function saveListName (e) {
    e.preventDefault();

    await taskService.saveListName(projectName);
    setEditListName(false);
  }

  return projectRender({
    // inputElement,
    open,
    completed,
    submit,
    changed,
    showCompleted,
    setShowCompleted,
    modalOpen,
    allCompleted,
    setModalOpen,
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
