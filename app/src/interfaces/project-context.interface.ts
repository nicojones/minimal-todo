import { Dispatch, SetStateAction } from "react";
import { IProject } from "./project.interface";
import { ITask } from "./task.interface";
import { Observable } from "rxjs";

export interface IProjectContext {
    reloadProjects: () => Observable<IProject[]>;
    project: IProject;
    setProject: (project: IProject) => any;
    reloadProjectTasks: () => Observable<ITask[]>;
    changeToProject: (value: Partial<IProject> | null, forceProject?: Partial<IProject> | null) => void;
    openAddUserModal: Dispatch<SetStateAction<IProject | null>>;
}