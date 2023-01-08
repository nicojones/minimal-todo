import { Dispatch, SetStateAction } from "react";
import { IProject } from "./project.interface";
import { ITask } from "./task.interface";

export interface IProjectContext {
    reloadProjects: () => Promise<IProject[]>;
    project: IProject;
    showDot: boolean;
    setProject: (project: IProject) => any;
    reloadProjectTasks: () => Promise<ITask[]>;
    changeToProject: (value: Partial<IProject> | null, forceProject?: Partial<IProject> | null) => void;
    openAddUserModal: Dispatch<SetStateAction<IProject | null>>;
}