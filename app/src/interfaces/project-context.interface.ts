import { Dispatch, SetStateAction } from "react";
import { IProject, MinimalProject } from "./project.interface";
import { ITask } from "./task.interface";
import { Observable } from "rxjs";

export interface IProjectContext {
    reloadProjects: () => Observable<IProject[]>;
    reloadProjectTasks: () => Observable<ITask[]>;
    changeToProject: (value: MinimalProject | null, forceProject?: Partial<IProject> | null) => void;
    openAddUserModal: Dispatch<SetStateAction<IProject | null>>;
}