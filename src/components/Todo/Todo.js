import { useMemo, useState } from 'react';
import './_todo.scss';
import todoRenderer from 'components/Todo/Todo-view';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from '../../text';

function Todo ({ list }) {

  const [showCompleted, setShowCompleted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [editListName, setEditListName] = useState(false);

  const open = list.tasks.filter((task) => !task.checked);
  const completed = list.tasks.filter((task) => !!task.checked);

  const allCompleted = useMemo(() => text.allTasksCompleted(), [ open.length ]);

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

  return todoRenderer({
    open,
    completed,
    deleteTask: (task) => taskService.deleteTask(task, list.tasks),
    submit,
    changed,
    showCompleted,
    setShowCompleted,
    modalOpen,
    allCompleted,
    setModalOpen,
    list: {
      listName,
      saveListName,
      editListName,
      setEditListName,
      setListName
    }
  });
}

export default Todo;
