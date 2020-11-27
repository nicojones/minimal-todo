import React, { useEffect, useMemo, useState } from 'react';
import reservedKey from 'functions/reservedKey';
import drawerService from 'services/drawerService';
import Task from 'components/Project/Project/Task/Task';
import { text } from 'config/text';

function Drawer ({ projectKey }) {

  const [loading, setLoading] = useState(true);
  const [drawerTasks, setDrawerTasks] = useState([]);

  const allCompleted = useMemo(() => {
    return text.allTasksCompleted();
  }, []);

  useEffect(() => {
    if (reservedKey(projectKey)) {
      // Special project, like an inbox...
      const unsubscribeProject = drawerService.getDrawer(projectKey, (tasks) => {
        setDrawerTasks(tasks);
        setLoading(false);
      });

      return () => {
        unsubscribeProject && unsubscribeProject();
      };

    }
  }, [projectKey]);

  return (
    <>
      <div className="flex-row">
        <h5 className="max-content m0">{ text.drawer.inbox._ }</h5>
      </div>
      <ul>
        {
          drawerTasks.length
          ? drawerTasks.map((t) => {
            console.log('task is T', t);
            return <Task key={ t.id } task={ t } level={ 0 }/>;
          })
          : <li><h5 className="subtle max-content ml-50">{ allCompleted }</h5></li>
        }
      </ul>

    </>
  );
}

export default Drawer;
