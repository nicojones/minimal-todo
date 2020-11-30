import { text } from '../../config/text';
import React, { useContext, useState } from 'react';
import { ProjectDispatch } from '../../TodoApp';
import taskService from '../../services/taskService';

function NavbarSearch () {

  const projectDispatch = useContext(ProjectDispatch);

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  function searchResults (e) {
    e.preventDefault();

    taskService.searchTask(search).then((results) => {
      setResults(results);
      console.log('set the results', results);
    })
  }

  function goToResult (result) {
    console.log(result);
    setResults([]);
    projectDispatch({ id: result.projectId });
  }

  console.log('results', results.length);
  return (
    <>
      <form className="left" id="search-tasks" onSubmit={ searchResults }>
        {/*<i className="material-icons tiny">search</i>*/ }
        <input
          type="text" className="input" placeholder={ text.task.search } value={ search }
          onChange={ (e) => setSearch(e.target.value) }
        />
        {
          results.length
            ? <>
                <div className="backdrop dark" onClick={ () => setResults([]) }/>
                <ul className="search-results dropdown dd-big">{
                  results.map((r) =>
                    <li key={ r.id } className="dropdown-item pointer" onClick={ () => goToResult(r) }>
                      <i className="material-icons left subtle tiny btn-pr">{ r.checked ? 'check_box' : 'check_box_outline_blank' }</i>
                      { r.name }
                    </li>)
                }</ul>
              </>
            : ''
        }
      </form>
    </>
  );
}

export default NavbarSearch;
