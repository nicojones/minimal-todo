import { useMemo, useState } from 'react';
import './_project.scss';
import projectRender from 'components/Project/Project-view';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from 'text';

function Project ({ project }) {

  const [showCompleted, setShowCompleted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [listName, setListName] = useState(project.name);
  const [editListName, setEditListName] = useState(false);

  const open = (project.tasks || []).filter((task) => !task.checked);
  const completed = (project.tasks || []).filter((task) => !!task.checked);

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted()
  }, [ open.length ]);

  let taskName = '';

  async function submit (e) {
    e.preventDefault();

    await taskService.addTask(createTaskObject({ name: taskName }));
  }

  function changed (e) {
    taskName = e.target.value;
  }

  async function saveListName (e) {
    e.preventDefault();

    await taskService.saveListName(listName);
    setEditListName(false);
  }

  return projectRender({
    open,
    completed,
    deleteTask: (task) => taskService.deleteTask(task, project.tasks),
    submit,
    changed,
    showCompleted,
    setShowCompleted,
    modalOpen,
    allCompleted,
    setModalOpen,
    project: {
      listName,
      saveListName,
      editListName,
      setEditListName,
      setListName
    }
  });
}

export default Project;
