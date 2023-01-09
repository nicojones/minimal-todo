import { EntityValidation, ITask } from "interfaces";

export const validateTask = (task: Partial<ITask>): EntityValidation<ITask> => {
  const validation: EntityValidation<ITask> = {};

  if ((task.name?.length || 0) < 3) {
    validation.name = "At least 3 characters";
  }
  if ((task.description?.length || 0) > 100) {
    validation.description = "Maximum 100 characters";
  }
  if(typeof task.priority !== "number") {
    validation.priority = "Invalid priority";
  }

  return validation;
}