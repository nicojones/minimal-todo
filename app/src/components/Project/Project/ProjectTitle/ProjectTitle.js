import React, { useContext } from 'react';
import { text } from 'config/text';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import { ProjectContext } from 'TodoApp';

function ProjectTitle ({ projectFunctions, showCompleted, toggleShowCompleted, isLoading }) {

  const project = useContext(ProjectContext);

  console.log('projjj', project);

  return (
    projectFunctions.editListName
      ? <form onSubmit={ projectFunctions.saveListName } className={ ( isLoading === 'name' ? ' loader-input' : '' ) }>
        <input
          className="as-title m0 invisible h5" autoFocus /*onBlur={ project.saveListName }*/
          value={ projectFunctions.projectName }
          disabled={ isLoading === 'name' }
          onBlur={ () => projectFunctions.setEditListName(false) }
          onChange={ (e) => projectFunctions.setProjectName(e.target.value) }
        />
      </form>
      : <div className="flex-row">
        <ColorPicker color={ project.color } onChangeComplete={ projectFunctions.changeColor }/>
        <h5 className="max-content m0" onClick={ () => projectFunctions.setEditListName(true) }>{ projectFunctions.projectName }</h5>
        {
          project.showCompleted
            ? <button
              className="material-icons ml-5 toggle-completed btn-invisible subtle o-3"
              onClick={ () => toggleShowCompleted(false) }
              title={ text.hideCompleted }
            >check_box</button>
            : <button
              className="material-icons ml-5 toggle-completed btn-invisible subtle o-3"
              onClick={ () => toggleShowCompleted(true) }
              title={ text.showCompleted }
            >check_box_outline_blank</button>
        }
      </div>
  );
}

export default ProjectTitle;
