import React from 'react';
import { text } from 'text';

function ProjectTitle ({ project, showCompleted, setShowCompleted }) {
  return (
    project.editListName
      ? <form onSubmit={ project.saveListName }>
        <input
          className="as-title m0 invisible h4" autoFocus /*onBlur={ project.saveListName }*/
          value={ project.listName || text.noListName }
          onChange={ (e) => project.setListName(e.target.value) }
        />
      </form>
      : <div className="flex-row">
        <h4 className="max-content m0" onClick={ () => project.setEditListName(true) }>{ project.listName || text.noListName }</h4>
        {
          showCompleted
            ? <button
              className="material-icons ml-5 toggle-completed btn-invisible subtle"
              onClick={ () => setShowCompleted(false) }
              title={ text.hideCompleted }
            >check_box</button>
            : <button
              className="material-icons ml-5 toggle-completed btn-invisible subtle"
              onClick={ () => setShowCompleted(true) }
              title={ text.showCompleted }
            >check_box_outline_blank</button>
        }
      </div>
  );
}

export default ProjectTitle;
