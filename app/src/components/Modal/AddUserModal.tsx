import { Modal } from "components/Modal/Modal";
import { text } from "config";
import { IProject, UserSearchResults } from "interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { ProjectService } from "services";

interface AddUserModalAttrs {
  modalProject: IProject | null;
  setModalProject: Dispatch<SetStateAction<IProject | null>>;
  project: IProject;
}

export const AddUserModal = (
  { modalProject, setModalProject }: AddUserModalAttrs
) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [results, setResults] = useState<UserSearchResults[]>([]);

  const searchUsers = (): Promise<void> => {
    setLoading(true);
    return ProjectService.getUsersByEmail(email)
    .then((response: UserSearchResults[]) => {
        setLoading(false);
        setResults(response);
      })
  };

  const selectEmail = (result: UserSearchResults) => {
    return ProjectService.addUserToProject(modalProject as IProject, result)
      .then(() => {
        window.location.reload();
      })
  };

  return (
    <>
      <Modal
        modalOpen={!!modalProject}
        loading={loading}
        onAccept={searchUsers}
        onCancel={() => setModalProject(null)}
        okButton={'<i class="material-icons right">save</i>'}
        cancelButton={'<i class="material-icons right">close</i>'}
        header={'Add user ???'}
      >
        {/*<h6 className="subtle mb-15 mt-5">{ project.name }</h6>*/}
        <form onSubmit={searchUsers}>
          <div>
            {/*<label>{ text.task.name }</label>*/}
            <input
              value={email}
              type="email"
              required
              placeholder={text.user.email.enter}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </form>

        <ul className="list-unstyled flex-column">
          {results.map((result: UserSearchResults) =>
            <li key={result}>
              <button onClick={() => selectEmail(result)} type="button">
                <i className="material-icons">add</i>
              </button>
              {result}
            </li>
          )}
        </ul>
      </Modal>
    </>
  );
};
