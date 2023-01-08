import {text} from "../../config/text";
import React, {useContext, useState} from "react";
import {ProjectContext} from "../../TodoApp";
import {IProjectContext, ITask, PDefault} from "../../interfaces";
import {TaskService} from "../../services";

export const NavbarSearch = () => {
  const {changeToProject} = useContext<IProjectContext>(ProjectContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ITask[]>([]);

  function searchResults(e: PDefault) {
    e.preventDefault();

    // @ts-ignore
    TaskService.searchTask(search).then((results: ITask[]) => {
      if (results.length) {
        setResults(results);
      } else {
        setResults([{ name: text.task.noResults } as ITask]);
      }
    });
  }

  function goToResult(result: ITask) {
    setResults([]);
    changeToProject({ secret: result.projectSecret });
  }

  return (
    <form className="left" id="search-tasks" onSubmit={searchResults}>
      {/*<i className="material-icons tiny">search</i>*/}
      <input
        type="text"
        className="input"
        placeholder={text.task.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        required={true}
        minLength={2}
      />
      {results.length ? (
        <>
          <div className="backdrop dark" onClick={() => setResults([])} />
          <ul className="search-results dropdown">
            {results.map((r) => (
              <li
                key={r.id}
                className="dropdown-item pointer"
                onClick={() => r.projectId && goToResult(r)}
              >
                <i className="material-icons left subtle btn-pr ">
                  {r.done ? "check_box" : "check_box_outline_blank"}
                </i>
                {r.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        ""
      )}
    </form>
  );
}
