import React, { useContext, useState } from 'react';
import './_task.scss';
import TaskModal from 'components/Modal/TaskModal';
import Subtask from './Subtask';
import { text } from 'text';
import taskService from 'services/taskService';
import { ProjectContext } from 'TodoApp';

function Task ({ task }) {
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedTask, setExpandedTask] = useState(false);

  const project = useContext(ProjectContext);

  const completedSubtasks = subtasks.filter((s) => !!s.checked).length;

  async function toggleCompleted (task) {
    task.checked = !task.checked;
    // after changing the state...
    if (task.checked) {
      // set all subtasks as checked, since the main task was marked as checked.
      (task.subtasks || []).forEach((_task) => _task.checked = true);
      task.expanded = false;
    }
    await taskService.updateTask(project.id, task);
  }

  /**
   * If you want to say the toggle state, just update this function
   */
  async function toggleExpanded (isExpanded) {
    //task.expanded = isExpanded;
    // await taskService.updateTask(task);
    setExpandedTask(isExpanded);
  }

  async function saveSubtasks (task) {
    setSubtasks(task.subtasks);
    await taskService.updateTask(project.id, task);
  }

  async function onDelete () {
    if (window.confirm(text.deleteTask)) {

      await taskService.deleteTask(project.id, task)
    }
  }

  return (
    <li className={ (task.checked ? 'done' : '') + ' parent-hover task' } title={ task.timestamp }>
      <div className="task-content">
        <button
          className={ 'toggle-expand subtle btn-invisible material-icons tiny left ' + (expandedTask && ' expanded') }
          onClick={ () => toggleExpanded(!expandedTask) }
        >chevron_right
        </button>
        <label className="left">
          <input
            type="checkbox"
            className="material-cb"
            checked={ task.checked }
            onChange={ () => toggleCompleted(task) }
          />
          <div/>
        </label>
        <button
          className={ 'btn-invisible task-name ' + (task.checked ? '' : '') }
          onClick={ () => setModalOpen(true) }>
          { task.name }
          <span className="subtle child-hover ml-5" title={ text.subtaskStatus }
          >({ completedSubtasks } / { subtasks.length - completedSubtasks })</span>
        </button>

        <span className="right">
          <button
            className="child-hover btn-subtle ml-5 material-icons right"
            onClick={ () => onDelete(task) }
          >delete
          </button>
          <TaskModal
            trigger={ {
              className: 'child-hover btn-subtle ml-5 material-icons right',
              text: 'edit'
            } } task={ { ...task } }
            modalOpen={ modalOpen }
            setModalOpen={ setModalOpen }
          />
        </span>
      </div>
      {
        expandedTask &&
        <>
          {
            task.description &&
            <div className="ml-50">
              <p><span className="subtle">{ text.notes }:</span> { task.description }</p>
            </div>
          }
          <Subtask extraClass={ 'ml-50' } saveSubtasks={ saveSubtasks } subtasks={ subtasks } task={ task }/>
        </>
      }
    </li>
  );
}

export default Task;
