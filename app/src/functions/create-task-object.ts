import {showToast} from 'services/toast';
import {ITask} from '../interfaces';


export function createTaskObject(task: Partial<ITask<string>>): ITask {
  if (!task.project) {
    showToast('error', 'No project id!');
    console.error(task);
  }

  return {
    name: task.name || '',
    done: task.done || false,
    id: (task.id || null) as unknown as ITask['id'], // set it to null or a valid value. Else it will fail
    timestamp: +new Date(task.timestamp as string),
    level: task.level || 0,
    parentId: (task.parentId || null) as unknown as ITask['parentId'],
    description: task.description || '',
    project: task.project as ITask['project'],
    priority: task.priority || 0,
    expanded: false,
    subtasks: [],
    created: +new Date(),
    updated: null
  };
}

