import { text } from 'config/text';

function NoProject ({ setShowSidebar }) {
  return (
    <>
      <button className="btn-invisible left-align" onClick={ () => setShowSidebar(true) }>{ text.noProjSelected }</button>
    </>
  )
}

export default NoProject;
