import { createStore } from "@ngneat/elf";
import { selectAllEntities, withEntities } from "@ngneat/elf-entities";
import { MinimalProject, Stores } from "interfaces";

export const projectStore = createStore(
  { name: Stores.SELECTED_PROJECT },
  withEntities<MinimalProject>()
);

export const project$ = projectStore.pipe(selectAllEntities());
