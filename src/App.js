import React from 'react';
import Todo from './Todo/Todo';

function App () {

  return (
    <React.Fragment>
      <div className="center" id="todo">
        <Todo />
      </div>
    </React.Fragment>
  );
}

export default App;
