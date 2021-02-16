import { showToast } from 'services/toast';
import { ITask } from '../interfaces';


export function createTaskObject (task: Partial<ITask>): ITask {
  if (!task.projectId) {
    showToast('error', 'No project id!');
    console.error(task);
  }

  return {
    name: task.name || '',
    checked: task.checked || false,
    id: (task.id || null) as unknown as ITask['id'], // set it to null or a valid value. Else it will fail
    timestamp: task.timestamp || new Date(),
    level: task.level || 0,
    parentId: (task.parentId || null) as unknown as ITask['parentId'],
    description: task.description || '',
    projectId: task.projectId as ITask['projectId'],
    priority: task.priority || 0,
    expanded: false,
    subtasks: []
  };
}

