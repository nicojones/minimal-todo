import React  from 'react';

function Modal ({ trigger, children, modalOpen, setModalOpen }) {

  return (
    <React.Fragment>
      <a className={ trigger.className } href="#!"
        onClick={ () => setModalOpen(true) }>{ trigger.text }</a>

      <div id="modal1" className={ 'modal ' + (modalOpen ? 'open' : '') }>
        <div className="modal-content">
          { children }
        </div>
        <div className="modal-footer">
          <a
            href="#!" onClick={ () => setModalOpen(false) }
            className="modal-close waves-effect waves-green btn-flat"
          >Agree</a>
        </div>
      </div>
      <div className="backdrop" onClick={ () => setModalOpen(false) }/>
    </React.Fragment>
  );
}

export default Modal;
