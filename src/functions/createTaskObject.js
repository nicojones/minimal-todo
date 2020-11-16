function createTaskObject (task) {
  return {
    name: task.name || '',
    checked: task.checked || false,
    key: task.key || null, // set it to null or a valid value. Else it will fail
    timestamp: task.timestamp || new Date(),
    subtasks: task.subtasks || [], // will not be saved in the DB. here just for reference...
    description: task.description || ''
  }
}

export default createTaskObject;
