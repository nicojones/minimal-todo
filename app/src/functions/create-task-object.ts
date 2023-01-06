import {showToast} from 'services/toast';
import {ITask} from '../interfaces';


export function createTaskObject(task: Partial<ITask<string>>): ITask {
  if (!task.projectId) {
    showToast('error', 'No project id!');
    console.error(task);
  }

  return {
    name: task.name || '',
    done: task.done || false,
    id: (task.id || null) as unknown as ITask['id'], // set it to null or a valid value. Else it will fail
    level: task.level || 1,
    parentId: (task.parentId || null) as unknown as ITask['parentId'],
    description: task.description || '',
    projectId: task.projectId as ITask['projectId'],
    priority: task.priority || 0,
    expanded: false,
    subtasks: [],
    created: null as unknown as string,
    updated: null as unknown as string,
    dotColor: null as unknown as string,
    projectName: null as unknown as string
  };
}

