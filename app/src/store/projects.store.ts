import { IProject } from "interfaces";
import { atom } from "jotai";

const _projectsAtom = atom<IProject[]>([]);

export const projectsAtom = atom<IProject[], IProject[]>(
  (get) => get(_projectsAtom),
  (get, set, payload) => set(_projectsAtom, payload)
);
