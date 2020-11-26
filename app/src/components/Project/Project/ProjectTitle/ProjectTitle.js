import React from 'react';
import { text } from 'config/text';

function ProjectTitle ({ project, showCompleted, setShowCompleted, isLoading }) {

  return (
    project.editListName
      ? <form onSubmit={ project.saveListName } className={ ( isLoading === 'name' ? ' loader-input' : '' ) }>
        <input
          className="as-title m0 invisible h5" autoFocus /*onBlur={ project.saveListName }*/
          value={ project.projectName }
          disabled={ isLoading === 'name' }
          onChange={ (e) => project.setProjectName(e.target.value) }
        />
      </form>
      : <div className="flex-row">
        <h5 className="max-content m0" onClick={ () => project.setEditListName(true) }>{ project.projectName }</h5>
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
