import { createStore } from "@ngneat/elf";
import { selectAllEntities, withEntities } from "@ngneat/elf-entities";
import { ITask, Stores } from "interfaces";

export const tasksStore = createStore({ name: Stores.TASKS }, withEntities<ITask>());

export const tasks$ = tasksStore.pipe(selectAllEntities());