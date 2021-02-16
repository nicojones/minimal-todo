import React, { useContext, useEffect, useState } from 'react';
import './_task.scss';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { TaskModal } from 'components/Modal/TaskModal';
import { taskService } from 'services';
import { constants, text } from 'config';
import { ProjectContext } from 'TodoApp';
import { IProject, ITask } from 'interfaces';


interface TaskAttrs {
  task: ITask;
  level?: number;
}
export function Task ({ task, level }: TaskAttrs) {

  const [subtasks, setSubtasks] = useState<ITask[]>(task.subtasks || []);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [expandedTask, setExpandedTask] = useState<boolean>(task.expanded || false);

  const project = useContext<IProject>(ProjectContext);

  const openLength = subtasks.filter((s: ITask) => !s.checked).length || 0;

  const doneClass = (task.checked && project.showCompleted && 'done') || '';
  // const doneClass = (task.checked ? (project.showCompleted ? 'done' : '') : '');

  const showExpanderClass = ((project.showCompleted ? subtasks.length : openLength) ? '' : ' v-hidden')

  useEffect(() => {
    setSubtasks(task.subtasks || []);
  }, [task.subtasks]);

  async function toggleCompleted (task: ITask) {
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
  async function toggleExpanded (isExpanded: boolean) {
    // task.expanded = isExpanded;
    // await taskService.updateTask(task);
    setExpandedTask(isExpanded);
  }

  async function onDelete (task: ITask) {
    if (window.confirm(text.task.delete.all)) {
      await taskService.deleteTask(task);
    }
  }

  return (
    <li className={ doneClass + ' task' }>
      <Tooltip/>
      <div className="task__content parent-hover" data-tip={ task.timestamp }>
        <button
          className={ 'toggle-expand subtle ib material-icons tiny left btn-pr' + (expandedTask ? ' expanded' : '') + showExpanderClass }
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
          className={ 'left-align ib ' + (task.checked ? '' : '') }
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

        <span className="child-hover ml-auto flex-row">
          <button
            className="material-icons ib task__action-button"
            data-tip={ text.task.delete._ }
            onClick={ () => onDelete(task) }>delete</button>
          <button
            className="material-icons ib task__action-button"
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
              <ul className="subtasks" aria-details={ (level || 0) as unknown as string }>
                {
                  subtasks.map((t) =>
                    <Task
                      key={ t.id }
                      task={ t }
                      level={ (level || 0) + 1 }
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
