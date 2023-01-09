import { Modal } from "components/Modal/Modal";
import { text } from "config";
import {
  IProject,
  IProjectContext,
  LoginUser,
  PDefault,
  UserSearchResults as UserSearchResult,
} from "interfaces";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthService, ProjectService, showToast } from "services";

import "./_add-user-modal.scss";
import { ProjectContext } from "TodoApp";
import { Observable, of, switchMap, tap } from "rxjs";

interface AddUserModalAttrs {
  modalProject: IProject | null;
  setModalProject: Dispatch<SetStateAction<IProject | null>>;
  project: IProject;
}

export const AddUserModal = ({
  modalProject,
  setModalProject,
}: AddUserModalAttrs) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [projectUsers, setProjectUsers] = useState<UserSearchResult[]>([]);

  const { reloadProjects } = useContext<IProjectContext>(ProjectContext);

  useEffect(() => {
    getListUsers().subscribe();
  }, []);

  const searchUsers = (e: PDefault): void => {
    e.preventDefault();

    setLoading(true);
    ProjectService.getUsersByEmail(searchTerm).pipe(
      tap((response: UserSearchResult[]) => {
        setLoading(false);
        setSearchResults(response);
      })
    ).subscribe();
  };

  const getListUsers = (): Observable<UserSearchResult[]> => {
    return ProjectService.getProjectUsers(modalProject as IProject).pipe(
      tap((users: UserSearchResult[]) => {
        setProjectUsers(users);
      })
    );
  };

  const addUserToProject = (result: UserSearchResult): void => {
    ProjectService.addUserToProject(
      modalProject as IProject,
      result
    ).pipe(
      switchMap(() => {
        showToast("success", text.project.add.u(result))
        setSearchResults([]);
        setSearchTerm("");
        getListUsers().subscribe();
        return reloadProjects();
      })
    ).subscribe();
  };

  const removeUserFromProject = (user: UserSearchResult): Observable<void> => {
    const currentUser: LoginUser = AuthService.currentUser() as LoginUser;
    const removeYourself = (currentUser.email === user);
    if (
      window.confirm(
        removeYourself
          ? text.sharedProject.removeYourself(modalProject?.name as string)
          : text.sharedProject.remove(user, modalProject?.name as string)
      )
    ) {
      return ProjectService.removeUserFromProject(
        modalProject as IProject,
        user
      ).pipe(
        tap(() => {
          showToast("success", text.project.remove.u(user))
          if (removeYourself) {
            window.location.reload();
          } else {
            getListUsers().subscribe();
            reloadProjects().subscribe();
          }
        })
      );
    }
    return of();
  };

  return (
    <>
      <Modal
        modalOpen={!!modalProject}
        loading={loading}
        onAccept={searchUsers}
        onCancel={() => setModalProject(null)}
        cancelButton={'<i class="material-icons right">close</i>'}
        header={text.sharedProject.header}
      >
        {/*<h6 className="subtle mb-15 mt-5">{ project.name }</h6>*/}
        <form onSubmit={searchUsers}>
          <div className="d-flex align-center">
            {/*<label>{ text.task.name }</label>*/}
            <button onClick={searchUsers} type="button" className="btn">
              <i className="material-icons">search</i>
            </button>
            <input
              value={searchTerm}
              type="email"
              required
              placeholder={text.sharedProject.addByEmail}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {searchResults.length > 0 ? (
          <>
            <h6>{text.sharedProject.results}</h6>
            <ul className="list-unstyled flex-column results-list">
              {searchResults.map((result: UserSearchResult) => {
                const belongsToProject = projectUsers.includes(result);
                return (
                  <li
                    key={result}
                    className={`result ${
                      belongsToProject ? "result-disabled" : ""
                    }`}
                    title={belongsToProject ? text.sharedProject.belongs : ""}
                  >
                    <button
                      onClick={() => addUserToProject(result)}
                      type="button"
                      className="btn"
                      disabled={belongsToProject}
                    >
                      <i className="material-icons">add</i>
                    </button>
                    {result}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}

        {projectUsers.length > 0 ? (
          <>
            <h6>{text.sharedProject.users}</h6>
            <ul className="list-unstyled flex-column results-list">
              {projectUsers.map((result: UserSearchResult, index: number) => (
                <li key={result} className="result">
                  {result === modalProject?.adminEmail ? (
                    <div className="project-user">
                      <span className="result">{result}</span>
                      <small className="subtext">
                        {text.sharedProject.admin}
                      </small>
                    </div>
                  ) : (
                    <div className="project-user">
                      <span>
                        <span className="result">{result}</span>
                        <button
                          onClick={() =>
                            removeUserFromProject(result).subscribe()
                          }
                          type="button"
                          className="btn"
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Modal>
    </>
  );
};
