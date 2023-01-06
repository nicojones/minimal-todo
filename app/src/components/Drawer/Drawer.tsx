import React, { useContext, useEffect, useMemo, useState } from "react";
import { drawerConfig } from "config/drawer-config";
import { reservedKey } from "functions/reserved-key";
import { Task } from "components/Project/Task/Task";
import { text } from "config";
import { ProjectOptions } from "components/Project/ProjectOptions";
import { IProjectContext, ITask } from "../../interfaces";
import { ProjectContext } from "TodoApp";

interface DrawerAttrs {
  drawerUrl: string;
  tasks: ITask[];
}

export const Drawer = ({ drawerUrl, tasks }: DrawerAttrs) => {
  const drawer = drawerConfig[drawerUrl];

  const { reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(drawer.sort);

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted();
  }, []);

  useEffect(() => {
    if (reservedKey(drawerUrl)) {
      // Special project, like an inbox...
      reloadProjectTasks(sort)
        .then((tasks: ITask[]) => {
          setLoading(false);
        });
    }
  }, [drawerUrl, sort]);

  return (
    <div className={loading ? "loader-input cover" : ""}>
      <div className="project-title-bar">
        <h5 className="project-title" data-tip={drawer.text.tooltip}>
          {drawer.text._}
        </h5>
        <ProjectOptions sort={sort} setSort={setSort} moreDropdown={false}/>
      </div>
      <ul>
        {tasks.length ? (
          tasks.map((t) => <Task key={t.id} task={t} level={0} />)
        ) : (
          <li>
            <h5 className="subtle ml-50">{allCompleted}</h5>
          </li>
        )}
      </ul>
    </div>
  );
};
