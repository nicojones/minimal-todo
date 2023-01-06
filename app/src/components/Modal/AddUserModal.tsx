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
import { AuthService, ProjectService } from "services";

import "./_add-user-modal.scss";
import { ProjectContext } from "TodoApp";

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
    getListUsers();
  }, []);

  const searchUsers = (e: PDefault): Promise<void> => {
    e.preventDefault();

    setLoading(true);
    return ProjectService.getUsersByEmail(searchTerm).then(
      (response: UserSearchResult[]) => {
        setLoading(false);
        setSearchResults(response);
      }
    );
  };

  const getListUsers = (): Promise<void> => {
    return ProjectService.getProjectUsers(modalProject as IProject).then(
      (users: UserSearchResult[]) => {
        setProjectUsers(users);
      }
    );
  };

  const addUserToProject = (result: UserSearchResult) => {
    return ProjectService.addUserToProject(
      modalProject as IProject,
      result
    ).then(() => {
      getListUsers();
      reloadProjects();
      setSearchResults([]);
      setSearchTerm("");
    });
  };

  const removeUserFromProject = (user: UserSearchResult): Promise<void> => {
    const currentUser: LoginUser = AuthService.currentUser() as LoginUser;
    const removeYourself = currentUser.email == user;
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
      ).then(() => {
        if (removeYourself) {
          window.location.reload();
        } else {
          getListUsers();
          reloadProjects();
        }
      });
    }
    return Promise.resolve();
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
                          onClick={() => removeUserFromProject(result)}
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
