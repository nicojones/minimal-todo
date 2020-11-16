import React from 'react';
import Todo from 'components/Todo/Todo';

function App () {

  return (
    <React.Fragment>
      <div className="container" id="todo">
        {/*<React.Suspense fallback={<Loader />}>*/}
          <div>
            <Todo />
          </div>
        {/*</React.Suspense>*/}
      </div>
    </React.Fragment>
  );
}

export default App;
