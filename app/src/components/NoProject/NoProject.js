import { text } from 'config/text';

function NoProject ({ setShowSidebar }) {
  return (
    <>
      <div className="h-100 place-center">
        <button className="btn-invisible left-align flex-center-self" onClick={ () => setShowSidebar(true) }>{ text.project.noSelected }</button>
      </div>
    </>
  )
}

export default NoProject;
