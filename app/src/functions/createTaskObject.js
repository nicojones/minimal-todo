import cogoToast from 'cogo-toast';
import { constants } from '../config/constants';

function createTaskObject (task) {
  if (!task.projectId) {
    cogoToast.error('no project id!', constants.toast);
    console.log(task);
  }
  return {
    name: task.name || '',
    checked: task.checked || false,
    id: task.id || null, // set it to null or a valid value. Else it will fail
    timestamp: task.timestamp || new Date(),
    level: task.level || 0,
    parentId: task.parentId || null,
    description: task.description || '',
    projectId: task.projectId
  }
}

export default createTaskObject;
