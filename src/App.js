import React, { useEffect, useState } from 'react';
import Todo from 'components/Todo/Todo';
import taskService from './services/taskService';
import Loader from 'components/Loader/Loader';

function App () {

  const [tasks, setTasks] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    taskService.getTasks(setTasks, setShowLoader)
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  return (
    <React.Fragment>
      <div className="container flex-column" id="todo">
        {
          showLoader
          ? <Loader/>
          : <Todo tasks={ tasks } />
        }
      </div>
    </React.Fragment>
  );
}

export default App;
