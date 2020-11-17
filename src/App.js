import React from 'react';
import Todo from 'components/Todo/Todo';

function App () {

  return (
    <React.Fragment>
      <div className="container flex-column" id="todo">
        {/*<React.Suspense fallback={<Loader />}>*/ }
        <Todo/>
        {/*</React.Suspense>*/ }
      </div>
    </React.Fragment>
  );
}

export default App;
