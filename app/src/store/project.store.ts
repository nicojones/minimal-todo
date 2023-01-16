import { IProject } from "interfaces";
import { atom } from "jotai";

const _projectAtom = atom<IProject | null>(null);

export const projectAtom = atom<IProject | null, IProject | null>(
  (get) => get(_projectAtom),
  (get, set, payload) => {
    return set(_projectAtom, payload);
  }
  // (get, set, payload) => set(_projectAtom, get(_projectAtom) ? payload : null)
);
