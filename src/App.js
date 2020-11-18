import React, { useEffect, useState } from 'react';
import Todo from 'components/Todo/Todo';
import taskService from './services/taskService';
import Loader from 'components/Loader/Loader';

function App () {

  const [list, setList] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  const ListContext = React.createContext(list.key);

  useEffect(() => {
    taskService.getTasks(window.location.hash.substring(1),(list) => {
      setList(list);
      setShowLoader(false);
    });
    return () => {
      taskService.db.ref(taskService.path).off('value');
    }
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  return (
    <>
      <div className="container flex-column" id="todo">
        {
          showLoader
          ? <Loader/>
          : <ListContext.Provider value={list.key}>
              <Todo list={ list } />
            </ListContext.Provider>
        }
      </div>
    </>
  );
}

export default App;
