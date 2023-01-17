import {showToast} from 'services/toast';
import {ITask} from '../interfaces';


export function createTaskObject(task: Partial<ITask<string>>): ITask {
  if (!task.project_id) {
    showToast('error', 'No project id!');
    console.error(task);
  }

  return {
    name: task.name || '',
    done: task.done || false,
    id: (task.id || null) as unknown as ITask['id'], // set it to null or a valid value. Else it will fail
    level: task.level || 1,
    parent_id: (task.parent_id || null) as unknown as ITask['parent_id'],
    description: task.description || '',
    priority: task.priority || 0,
    expanded: false,
    subtasks: [],
    created: null as unknown as string,
    updated: null as unknown as string,
    dotColor: null as unknown as string,
    project_id: task.project_id as ITask['project_id'],
    projectName: null as unknown as string,
    icon: null as unknown as string,
    backgroundColor: task.backgroundColor || null,
    notes: task.notes || "",
    url: task.url || "",
    tags: task.tags || [],
    starred: task.starred || false,
    deadline: task.deadline || 0,
    alert: task.alert || 0
  };
}

