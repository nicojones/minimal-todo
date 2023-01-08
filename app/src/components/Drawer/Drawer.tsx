import { ProjectContext } from "TodoApp";
import { ProjectOptions } from "components/Project/ProjectOptions";
import { Task } from "components/Project/Task/Task";
import { drawerConfig } from "config/drawer-config";
import { reservedKey } from "functions/reserved-key";
import { useContext, useEffect, useState } from "react";
import { IProjectContext, ITask } from "../../interfaces";
import { text } from "config";

interface DrawerAttrs {
  drawerUrl: string;
  tasks: ITask[];
}

export const Drawer = ({ drawerUrl, tasks }: DrawerAttrs) => {
  const drawer = drawerConfig[drawerUrl];

  const { reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reservedKey(drawerUrl)) {
      // Special project, like an inbox...
      reloadProjectTasks().then((tasks: ITask[]) => {
        setLoading(false);
      });
    }
  }, [drawerUrl]);

  return (
    <div className={loading ? "loader-input cover" : ""}>
      <div className="project-title-bar">
        <h5 className="project-title" data-tip={drawer.text.tooltip}>
          <i className="material-icons mr-5">{drawer.icon}</i>
          {drawer.text._}
        </h5>
        <ProjectOptions moreDropdown={false} />
      </div>
      <ul>
        {tasks.length ? (
          tasks.map((t) => <Task key={t.id} task={t} level={0} />)
        ) : (
          <li>
            <br />
            <br />
            <h6 className="subtle ml-50">{text.drawerTasksCompleted[drawer.url]}</h6>
          </li>
        )}
      </ul>
    </div>
  );
};
