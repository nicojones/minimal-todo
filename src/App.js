import React from 'react';
import Todo from './components/Todo/Todo';

function App () {

  return (
    <React.Fragment>
      <div className="container" id="todo">
        <Todo />
      </div>
    </React.Fragment>
  );
}

export default App;
