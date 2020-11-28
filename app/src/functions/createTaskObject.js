import cogoToast from 'cogo-toast';
import { constants } from '../config/constants';

function createTaskObject (task) {
  if (!task.projectId) {
    cogoToast.error('No project id!', constants.toast);
    console.error(task);
  }
  console.log('with level!!!', task.level);
  return {
    name: task.name || '',
    checked: task.checked || false,
    id: task.id || null, // set it to null or a valid value. Else it will fail
    timestamp: task.timestamp || new Date(),
    level: task.level || 0,
    parentId: task.parentId || null,
    description: task.description || '',
    projectId: task.projectId,
    priority: task.priority || 0
  }
}

export default createTaskObject;
