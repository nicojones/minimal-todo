import { ProjectContext } from "TodoApp";
import { NoProject } from "components/NoProject/NoProject";
import { ProjectHeader } from "components/Project/ProjectHeader/ProjectHeader";
import { Task } from "components/Project/Task/Task";
import { text } from "config";
import { createTaskObject } from "functions/create-task-object";
import { ChangeEvent, useContext, useEffect, useMemo, useState, } from "react";
import { ProjectService } from "services/project.service";
import { TaskService } from "services/task.service";
import { IProject, IProjectContext, ITask, LoadingStates, PDefault } from "../../interfaces";
import "./_project.scss";

interface ProjectAttrs {
  tasks: ITask[];
}

export const Project = ({ tasks }: ProjectAttrs) => {
  const { project, reloadProjects, reloadProjectTasks, setProject } = useContext<IProjectContext>(ProjectContext);

  const [sort, setSort] = useState(project.sort);
  const [taskName, setTaskName] = useState("");
  const [isLoading, setIsLoading] = useState<LoadingStates>("yes");
  const [showCompleted, setShowCompleted] = useState(project.showCompleted);
  const [projectName, setProjectName] = useState(
    project.name || text.project.noName
  );
  const [editListName, setEditListName] = useState(false);

  const open = tasks.filter((task: ITask) => !task.done);
  const completed = tasks.filter((task: ITask) => !!task.done);

  const allCompleted = useMemo(() => {
    if (completed.length && !open.length && !showCompleted) {
      return (
        <li>
          <NoProject className="o-1" inspireText={text.allTasksCompleted()} />
        </li>
      );
    }
    return "";
  }, [tasks, showCompleted]);

  const addTaskPh = useMemo(() => {
    return text.task.addTaskPh();
  }, [project.id]);

  useEffect(() => {
    setProjectName(project.name);
    setShowCompleted(project.showCompleted);
    setIsLoading("p");

    reloadTasks();

  }, [project.id]);

  const reloadTasks = (): Promise<ITask[]> => {
    return reloadProjectTasks(project.sort)
      .then((tasks: ITask[]) => {
        setIsLoading("");
        setTaskName("");
        return tasks;
      })
  }

  const changedSort = (newSort: string): Promise<any> => {
    setSort(newSort);

    console.log("new sort", newSort);

    setProject({...project, sort: newSort});

    return ProjectService
      .updateProject({ ...project, sort: newSort })
      .then(() => reloadProjectTasks());
  }

  const addTask = (e: PDefault): Promise<ITask[]> => {
    e.preventDefault();
    setIsLoading("t");

    return TaskService.addTask(
      createTaskObject({
        name: taskName,
        projectId: project.id,
      })
    )
      .then((task: ITask | void) => {
        return reloadTasks()
      });
  }

  function taskNameChange(e: ChangeEvent<HTMLInputElement>) {
    setTaskName(e.target.value);
  }

  async function saveListName(e: PDefault) {
    e.preventDefault();

    setIsLoading("n");
    await update({ name: projectName });
    setEditListName(false);
    setIsLoading("");
  }

  async function update(projectPartial: Partial<IProject>) {
    return await ProjectService.updateProject({
      ...project,
      ...projectPartial,
    })
      .then(() => {
        reloadProjects();
      });
  }

  return (
    <div className={isLoading === "p" ? "loader-input cover" : ""}>
      <ProjectHeader
        projectFunctions={{
          projectName,
          setProjectName,
          saveListName,
          editListName,
          setEditListName,
          showCompleted,
          setShowCompleted,
          sort,
          setSort: changedSort,
        }}
        isLoading={isLoading}
      />

      <ul>
        {open.map((task) => (
          <Task key={task.id} task={task} level={0} />
        ))}
        {showCompleted &&
          completed.map((task) => <Task key={task.id} task={task} />)}

        <li className="task">
          <form
            onSubmit={addTask}
            className={
              "flex-row task__content form-inline" +
              (isLoading === "t" ? " loader-input" : "")
            }
          >
            {/*className={ 'flex-row task__content form-inline' + (isLoading === 't' ? ' loader-input' : '') }>*/}
            <i
              /* Just to give the right padding */ className="material-icons left v-hidden btn-p"
            >
              add
            </i>
            <button className="btn p0">
              <i className="material-icons left subtle btn-pr">
                {taskName ? "save" : "add"}
              </i>
            </button>
            <div className="flex-center-start w-100">
              <div className="input-group mb-2">
                <input
                  onChange={taskNameChange}
                  className="invisible f-100 btn-pl"
                  placeholder={addTaskPh}
                  required
                  value={taskName}
                  id="add-project-task" // used also in NoProject
                  disabled={isLoading === "t"}
                  autoComplete="off"
                /* ref={ inputElement } */
                />
              </div>
            </div>
          </form>
        </li>
        {allCompleted}
      </ul>
    </div>
  );
};
