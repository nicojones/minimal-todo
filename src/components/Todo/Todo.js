import { useEffect, useMemo, useRef, useState } from 'react';
import './_todo.scss';
import todoRenderer from 'components/Todo/Todo-view';
import taskService from 'services/taskService';
import createTaskObject from 'functions/createTaskObject';
import { text } from '../../text';

function Todo () {

  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const open = tasks.filter((task) => !task.checked);
  const completed = tasks.filter((task) => !!task.checked);

  const allCompleted = useMemo(() => text.allTasksCompleted(), [open.length]);

  let taskName = '';
  const inputElement = useRef(null);

  useEffect(() => {
    taskService.getTasks(setTasks);
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  async function submit (e) {
    e.preventDefault();

    await taskService.addTask(createTaskObject({ name: taskName }));

    inputElement.current.value = '';
  }

  function changed (e) {
    taskName = e.target.value;
  }

  return todoRenderer({
    inputElement,
    open,
    completed,
    deleteTask: (task) => taskService.deleteTask(task, tasks),
    submit,
    changed,
    showCompleted,
    setShowCompleted,
    modalOpen,
    allCompleted,
    setModalOpen
  });
}

export default Todo;
