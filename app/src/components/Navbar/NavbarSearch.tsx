import { text } from "../../config/text";
import React, { useContext, useState } from "react";
import { ProjectContext } from "../../TodoApp";
import {
  IProjectContext,
  ITask,
  MinimalProject,
  PDefault,
} from "../../interfaces";
import { TaskService, showToast } from "../../services";
import { Task } from "components/Project/Task/Task";
import { Observable, tap } from "rxjs";
import { createTaskObject } from "functions/create-task-object";

export const NavbarSearch = () => {
  const { changeToProject, reloadProjectTasks } =
    useContext<IProjectContext>(ProjectContext);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ITask[]>([]);

  const searchResults = (e: PDefault): Observable<ITask[]> => {
    e.preventDefault();

    return TaskService.searchTask(search).pipe(
      tap((results: ITask[]) => {
        if (results.length) {
          setResults(results);
        } else {
          setResults([]);
          showToast("error", text.task.noResults);
        }
      })
    );
  };

  return (
    <>
      <form
        className="left"
        id="search-tasks"
        onSubmit={(e) => searchResults(e).subscribe()}
      >
        {/*<i className="material-icons tiny">search</i>*/}
        <input
          type="text"
          className="input"
          placeholder={text.task.search}
          value={search}
          autoCapitalize="none"
          onChange={(e) => setSearch(e.target.value)}
          required={true}
          minLength={2}
        />
      </form>
      {results.length ? (
        <>
          <div className="backdrop dark" onClick={() => setResults([])} />
          <ul className="search-results dropdown">
            {results.map((r: ITask) => (
              <Task
                task={r}
                level={0}
                key={r.id}
                showDot={true}
                showActions={true}
                onTaskToggle={() => reloadProjectTasks().subscribe()}
                showGoToProject={true}
                singleLevel={true}
              />
            ))}
          </ul>
        </>
      ) : (
        ""
      )}
    </>
  );
};
