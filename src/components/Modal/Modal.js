import React from 'react';

function Modal ({ children, modalOpen, okButton, cancelButton, onAccept, onCancel }) {

  return (
    <>
      {
        modalOpen ? <>
          <div className={ 'z-depth-5 modal open' }>
            <div className="modal-content">
              { children }
            </div>
            <div className="modal-footer">
              {
                okButton &&
                <button
                  onClick={ onAccept }
                  className="modal-close waves-effect waves-green btn-flat btn"
                  dangerouslySetInnerHTML={ { __html: okButton } }
                />
              }
              {
                cancelButton &&
                <button
                  onClick={ onCancel }
                  className="modal-close waves-effect waves-red btn-flat btn left"
                  dangerouslySetInnerHTML={ { __html: cancelButton } }
                />
              }
            </div>
          </div>
          <div className="backdrop" onClick={ onCancel }/>
        </>
        : ''
      }
    </>
  );
}

export default Modal;
