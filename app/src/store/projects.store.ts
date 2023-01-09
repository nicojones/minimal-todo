import { createStore } from "@ngneat/elf";
import { selectAllEntities, withEntities } from "@ngneat/elf-entities";
import { IProject, Stores } from "interfaces";

export const projectsStore = createStore(
  { name: Stores.PROJECTS },
  withEntities<IProject>()
);

export const projects$ = projectsStore.pipe(selectAllEntities());
