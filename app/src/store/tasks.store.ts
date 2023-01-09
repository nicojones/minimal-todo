import { ITask } from "interfaces";
import { atom } from "jotai";

const _tasksAtom = atom<ITask[]>([]);

export const tasksAtom = atom<ITask[], ITask[]>(
  (get) => get(_tasksAtom),
  (get, set, payload) => set(_tasksAtom, payload)
);
