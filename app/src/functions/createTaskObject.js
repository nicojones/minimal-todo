function createTaskObject (task) {
  return {
    name: task.name || '',
    checked: task.checked || false,
    id: task.id || null, // set it to null or a valid value. Else it will fail
    timestamp: task.timestamp || new Date(),
    level: task.level || 0,
    parentId: task.parentId || null,
    description: task.description || ''
  }
}

export default createTaskObject;
