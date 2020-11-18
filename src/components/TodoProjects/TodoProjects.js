import React, { useEffect, useState } from 'react';
import taskService from 'services/taskService';

function TodoProjects ({ setListKey, listKey }) {

  const [lists, setLists] = useState([]);

  function changeList (_listKey) {
    window.location.hash = _listKey;
    setListKey(_listKey);
  }

  useEffect( () => {
    taskService.getLists((_lists) => {
      setLists(_lists);
    });
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);
  return (
    <>
      <h3>Projects</h3>
      <ul>
        {
          lists.map((a) =>
            <li key={ a.key }>
              <button className="btn-subtle" onClick={ () => changeList(a.key) }>
                { a.name } ({ a.openTasks } <span className="subtle">/ { a.completedTasks }</span>)
              </button>
            </li>
          ) }
      </ul>
    </>
  );
}

export default TodoProjects;
