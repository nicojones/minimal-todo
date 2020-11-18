import React, { useEffect, useState } from 'react';
import taskService from 'services/taskService';
import { text } from 'text';
import './_todo-projects.scss';

function TodoProjects ({ listKey, setListKey }) {

  const [lists, setLists] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    taskService.getLists((_lists) => {
      setLists(_lists);
    });
  }, [/* empty dependency means this function will NEVER be called again === componentDidMount */]);

  function addNewProject (e) {
    e.preventDefault();

    taskService.newProject(newProjectName).then((snap) => {
      setShowAddProject(false);
      setNewProjectName('');
      console.log(setListKey(snap.key));
    });
  }

  return (
    <>
      <h3>{ text.projects }</h3>
      <ul className="projects-list">
        {
          lists.map((a) =>
            <li key={ a.key } className={ ( listKey === a.key ? 'selected' : '' ) }>
              <button className="btn-subtle" onClick={ () => setListKey(a.key) }>
                { a.name } ({ a.openTasks } <span className="subtle">/ { a.completedTasks }</span>)
              </button>
            </li>
          )
        }
        <li>
          {
            showAddProject
              ? <form onSubmit={ addNewProject }>
                <input
                  className="invisible subtle" onChange={ (e) => setNewProjectName(e.target.value) }
                  value={ newProjectName } autoFocus placeholder={ text.addProjectPh }
                />
              </form>
              : <button className="btn-subtle subtle" onClick={ () => setShowAddProject(true) }>{ text.addProject }</button>
          }
        </li>
      </ul>
    </>
  );
}

export default TodoProjects;
