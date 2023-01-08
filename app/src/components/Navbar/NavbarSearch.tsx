import { text } from "../../config/text";
import React, { useContext, useState } from "react";
import { ProjectContext } from "../../TodoApp";
import { IProjectContext, ITask, PDefault } from "../../interfaces";
import { TaskService } from "../../services";
import { Task } from "components/Project/Task/Task";

export const NavbarSearch = () => {
  const { changeToProject, reloadProjectTasks } = useContext<IProjectContext>(ProjectContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ITask[]>([]);

  function searchResults(e: PDefault) {
    e.preventDefault();

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
            {results.map((r: ITask) => (
              <Task
                task={r}
                level={0}
                key={r.secret}
                showDot={true}
                showActions={true}
                onTaskToggle={reloadProjectTasks}
                showGoToProject={false}
                singleLevel={true}
              />
            ))}
          </ul>
        </>
      ) : (
        ""
      )}
    </form>
  );
};
