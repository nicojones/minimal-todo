import React, { useEffect, useState } from 'react';
import Todo from 'components/Todo/Todo';
import taskService from './services/taskService';
import Loader from 'components/Loader/Loader';
import TodoProjects from './components/TodoProjects/TodoProjects';

function App () {

  const [listKey, setListKey] = useState(window.location.hash.substring(1) || '0');

  const [list, setList] = useState({});
  const [showLoader, setShowLoader] = useState(true);

  const ListContext = React.createContext(list.key);

  useEffect(() => {
    window.location.hash = listKey;

    taskService.getTasks(listKey, (list) => {
      setList(list);
      setShowLoader(false);
    });
    return () => {
      taskService.db.ref(taskService.path).off('value');
    };
  }, [listKey]);

  return (
    <>
      <div className="container flex-column" id="todo">
        {
          showLoader
            ? <Loader/>
            : <>
              <div className="row" style={ { width: '100%', margin: 0 } }>
                <div className="col s3">
                  <TodoProjects listKey={ listKey } setListKey={ setListKey }/>
                </div>
                <div className="col s9">
                  <ListContext.Provider value={ list.key }>
                    <Todo list={ list }/>
                  </ListContext.Provider>
                </div>
              </div>
            </>
        }
      </div>
    </>
  );
}

export default App;
