import { text } from '../../config/text';
import React, { useContext, useState } from 'react';
import { ProjectDispatch } from '../../TodoApp';
import { ITask, PDefault } from '../../interfaces';
import { taskService } from '../../services';


export function NavbarSearch () {

  const projectDispatch = useContext(ProjectDispatch);

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ITask[]>([]);

  function searchResults (e: PDefault) {
    e.preventDefault();

    // @ts-ignore
    taskService.searchTask(search).then((results: ITask[]) => {
      if (results.length) {
        setResults(results);
      } else {
        setResults([{ name: text.task.noResults } as ITask]);
      }
      console.log('set the results', results);
    });
  }

  function goToResult (result: ITask) {
    console.log(result);
    setResults([]);
    projectDispatch({ id: result.projectId });
  }

  return (
    <>
      <form className="left" id="search-tasks" onSubmit={ searchResults }>
        {/*<i className="material-icons tiny">search</i>*/ }
        <input
          type="text" className="input" placeholder={ text.task.search } value={ search }
          onChange={ (e) => setSearch(e.target.value) }
          required={ true } minLength={ 2 }
        />
        {
          results.length
            ? <>
              <div className="backdrop dark" onClick={ () => setResults([]) }/>
              <ul className="search-results dropdown">{
                results.map((r) =>
                  <li key={ r.id } className="dropdown-item pointer" onClick={ () => r.projectId && goToResult(r) }>
                    <i
                      className="material-icons left subtle btn-pr "
                    >{ r.checked ? 'check_box' : 'check_box_outline_blank' }</i>
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
