import React from 'react';
import { text } from 'text';

function ListTitle ({ list }) {
  return (
    list.editListName
      ? <form onSubmit={ list.saveListName }>
        <input
          className="as-title h2 invisible" autoFocus onBlur={ list.saveListName }
          value={ list.listName || text.noListName }
          onChange={ (e) => list.setListName(e.target.value) }
        />
      </form>
      : <h2 className="center-align" onClick={ () => list.setEditListName(true) }>{ list.listName || text.noListName }</h2>
  );
}

export default ListTitle;
