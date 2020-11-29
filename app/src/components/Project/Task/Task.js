import React, { useContext, useEffect, useState } from 'react';
import './_task.scss';
import TaskModal from 'components/Modal/TaskModal';
import { text } from 'config/text';
import taskService from 'services/taskService';
import { ProjectContext } from 'TodoApp';
import { constants } from 'config/constants';
import Tooltip from 'components/Tooltip/Tooltip';

function Task ({ task, level }) {

  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedTask, setExpandedTask] = useState(task.expanded || false);

  const project = useContext(ProjectContext);

  const openLength = subtasks.filter((s) => !s.checked).length || 0;

  const doneClass = (task.checked ? (project.showCompleted ? 'done' : 'hidden') : '');

  const showExpanderClass = ((project.showCompleted ? subtasks.length : openLength) ? '' : ' v-hidden')

  useEffect(() => {
    setSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  async function toggleCompleted (task) {
    task.checked = !task.checked;
    // after changing the state...
    if (task.checked) {
      // set all subtasks as checked, since the main task was marked as checked.
      // (task.subtasks || []).forEach((_task) => _task.checked = true);
      task.expanded = false;
    }
    await taskService.toggleTask(task);
    // await taskService.updateTask(project.id, task);
  }

  /**
   * If you want to say the toggle state, just update this function
   */
  async function toggleExpanded (isExpanded) {
    // task.expanded = isExpanded;
    // await taskService.updateTask(task);
    setExpandedTask(isExpanded);
  }

  async function onDelete () {
    if (window.confirm(text.task.delete.all)) {
      await taskService.deleteTask(task);
    }
  }

  return (
    <li className={ doneClass + ' task' } data-tip={ task.timestamp }>
      <Tooltip/>
      <div className="task__content parent-hover">
        <button
          className={ 'toggle-expand subtle btn-invisible material-icons tiny left btn-pr' + (expandedTask ? ' expanded' : '') + showExpanderClass }
          onClick={ () => toggleExpanded(!expandedTask) }
        >chevron_right
        </button>

        <label className={ 'left prio-' + task.priority }>
          <input
            type="checkbox"
            className="material-cb"
            checked={ task.checked }
            onChange={ () => toggleCompleted(task) }
          />
          <div/>
        </label>
        <button
          className={ 'left-align btn-invisible ' + (task.checked ? '' : '') }
          onClick={ () => setModalOpen(true) }
        >
          <span className="task-name">{ task.name }</span>
          { subtasks.length > 0
            ? <small className="subtle child-hover ml-5 ib"
              data-tip={ text.subtaskStatus } >({ openLength } / { subtasks.length - openLength })</small>
            : ''
          }
          { task.description && <small className="subtle ml-5">{ task.description }</small> }
        </button>

        <span className="ml-auto flex-row">
          <button
            className="child-hover material-icons btn-invisible task__action-button"
            data-tip={ text.task.delete._ }
            onClick={ () => onDelete(task) }>delete</button>
          <button
            className="child-hover material-icons btn-invisible task__action-button"
            data-tip={ text.task.edit }
            onClick={ () => setModalOpen(true) }>edit</button>

          <TaskModal
            task={ { ...task } }
            modalOpen={ modalOpen }
            setModalOpen={ setModalOpen }
          />
        </span>
      </div>
      {
        expandedTask &&
        <>
          {
            (task.level < constants.maxDepth) && <>
              <ul className="subtasks" aria-details={ level }>
                {
                  subtasks.map((t) =>
                    <Task
                      key={ t.id }
                      task={ t }
                      level={ level + 1 }
                    />
                  )
                }
              </ul>
            </>
          }
        </>
      }
    </li>
  );
}

export default Task;
