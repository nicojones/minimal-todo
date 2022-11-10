import React, {ChangeEvent, useContext, useEffect, useMemo, useState,} from "react";
import "./_project.scss";
import {taskService} from "services/task.service";
import {createTaskObject} from "functions/create-task-object";
import {projectService} from "services/project.service";
import {Task} from "components/Project/Task/Task";
import {ProjectHeader} from "components/Project/ProjectHeader/ProjectHeader";
import {text} from "config";
import {NoProject} from "components/NoProject/NoProject";
import {ProjectContext} from "TodoApp";
import {IProject, ITask, LoadingStates, PDefault} from "../../interfaces";

interface ProjectAttrs {
  changeToProject: (project: IProject) => any;
}

export const Project = ({changeToProject}: ProjectAttrs) => {
  const project = useContext<IProject>(ProjectContext);

  const [sort, setSort] = useState(project.sort);
  const [taskName, setTaskName] = useState("");
  const [projectTasks, setProjectTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState<LoadingStates>("yes");
  const [showCompleted, setShowCompleted] = useState(project.showCompleted);
  const [projectName, setProjectName] = useState(
    project.name || text.project.noName
  );
  const [editListName, setEditListName] = useState(false);

  const open = projectTasks.filter((task: ITask) => !task.done);
  const completed = projectTasks.filter((task: ITask) => !!task.done);

  // const inputElement = useRef(null);

  const allCompleted = useMemo(() => {
    if (completed.length && !open.length && !showCompleted) {
      return (
        <li>
          <NoProject className="o-1" inspireText={text.allTasksCompleted()}/>
        </li>
      );
    }
    return "";
  }, [projectTasks, showCompleted]);

  const addTaskPh = useMemo(() => {
    return text.task.addTaskPh();
  }, [project.id]);

  useEffect(() => {
    console.log("changed project id");
    setProjectName(project.name);
    setShowCompleted(project.showCompleted);
    setIsLoading("p");

    let unsubscribeProject: () => any;
    taskService.getTasksForProject(
      project.id,
      sort,
      (tasks: ITask[]) => {
        console.log("THE TASKS", tasks);
        setProjectTasks(tasks);
        setIsLoading("");

        if (project.id && sort !== project.sort) {
          projectService.updateProject({
            ...project,
            sort,
          });
        }
      }
    );

    return () => {
      unsubscribeProject && unsubscribeProject();
    };
  }, [project.id, sort]);

  async function addTask(e: PDefault) {
    e.preventDefault();
    setIsLoading("t");

    await taskService.addTask(
      project,
      createTaskObject({
        name: taskName,
        project: project.id,
      })
    );
    setIsLoading("");
    setTaskName("");
  }

  function taskNameChange(e: ChangeEvent<HTMLInputElement>) {
    setTaskName(e.target.value);
  }

  async function saveListName(e: PDefault) {
    e.preventDefault();

    setIsLoading("n");
    await update({name: projectName});
    setEditListName(false);
    setIsLoading("");
  }

  async function update(projectPartial: Partial<IProject>) {
    return await projectService.updateProject({
      ...project,
      ...projectPartial,
    });
  }

  return (
    <div className={isLoading === "p" ? "loader-input cover" : ""}>
      <ProjectHeader
        projectFunctions={{
          changeToProject,
          projectName,
          setProjectName,
          saveListName,
          editListName,
          setEditListName,
          showCompleted,
          setShowCompleted,
          sort,
          setSort,
        }}
        isLoading={isLoading}
      />

      <ul>
        {open.map((task) => (
          <Task key={task.id} task={task} level={0}/>
        ))}
        {showCompleted &&
          completed.map((task) => <Task key={task.id} task={task}/>)}

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
                  autoComplete="off" /*ref={ inputElement }*/
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
