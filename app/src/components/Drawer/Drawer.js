import React, { useEffect, useMemo, useState } from 'react';
import reservedKey from 'functions/reservedKey';
import drawerService from 'services/drawerService';
import Task from 'components/Project/Task/Task';
import { text } from 'config/text';
import ProjectOptions from 'components/Project/ProjectOptions';
import { drawerConfig } from 'config/drawerConfig';

function Drawer ({ drawerUrl }) {

  const drawer = drawerConfig[drawerUrl];

  const [loading, setLoading] = useState(true);
  const [drawerTasks, setDrawerTasks] = useState([]);
  const [sort, setSort] = useState(drawer.sort)

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted();
  }, []);

  useEffect(() => {
    if (reservedKey(drawerUrl)) {
      // Special project, like an inbox...
      const unsubscribeProject = drawerService.getDrawer(drawerUrl, sort, (tasks) => {
        setDrawerTasks(tasks);
        setLoading(false);
      });

      return () => {
        unsubscribeProject && unsubscribeProject();
      };

    }
  }, [drawerUrl, sort]);

  return (
    <>
      <div className={ loading ? 'loader-input cover' : '' }>
        <div className="project-title-bar">
          <h5 className="project-title" data-tip={ drawer.text.tooltip }>{ drawer.text._ }</h5>
          <ProjectOptions sort={ sort } setSort={ setSort }/>
        </div>
        <ul>
          {
            drawerTasks.length
              ? drawerTasks.map((t) => <Task key={ t.id } task={ t } level={ 0 }/>)
              : <li><h5 className="subtle ml-50">{ allCompleted }</h5></li>
          }
        </ul>
      </div>

    </>
  );
}

export default Drawer;
