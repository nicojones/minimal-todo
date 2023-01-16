import { ProjectContext } from "TodoApp";
import { text } from "config";
import { IProject, IProjectContext } from "interfaces";
import { useContext, useState } from "react";

interface ProjectListDropdownAttrs {
  project: IProject;
  onDelete: (project: IProject) => any;
}
export function ProjectListDropdown({
  project,
  onDelete,
}: ProjectListDropdownAttrs) {
  const [dropdownShown, setDropdownShown] = useState(false);

  const { openAddUserModal } = useContext<IProjectContext>(ProjectContext);

  return (
    <>
      <button
        className="btn child-hover dropdown-btn"
        onClick={() => setDropdownShown(true)}
      >
        <i className="tiny material-icons subtle">more_horiz</i>
      </button>
      {dropdownShown && (
        <>
          <ul
            className="dropdown dd-left"
            onClick={() => setDropdownShown(false)}
          >
            <li className="dropdown-item">
              <button
                className="ib left left-align w-100 p-10"
                onClick={() => openAddUserModal(project)}
              >
                <i className="tiny material-icons subtle">person_add</i>{" "}
                {text.project.share}
              </button>
            </li>
            {!project.shared ? (
              <li className="dropdown-item">
                <button
                  className="ib left left-align w-100 p-10"
                  onClick={() => onDelete(project)}
                >
                  <i className="tiny material-icons subtle">delete</i>{" "}
                  {text.project.delete._}
                </button>
              </li>
            ) : null}
          </ul>
          <div className="backdrop" onClick={() => setDropdownShown(false)} />
        </>
      )}
    </>
  );
}
