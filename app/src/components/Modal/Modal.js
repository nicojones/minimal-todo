import React from 'react';

function Modal ({ children, modalOpen, okButton, cancelButton, onAccept, onCancel, loading }) {

  return (
    <>
      {
        modalOpen ? <>
            <div className={ 'modal' }>
              <div className={ (loading ? ' loader-input cover' : '') }>
                <div className="modal-content">
                  { children }
                </div>
                <div className="modal-footer">
                  {
                    okButton &&
                    <button
                      onClick={ onAccept }
                      className="modal-close waves-effect waves-green btn"
                      dangerouslySetInnerHTML={ { __html: okButton } }
                    />
                  }
                  {
                    cancelButton &&
                    <button
                      onClick={ onCancel }
                      className="modal-close waves-effect waves-red btn left"
                      dangerouslySetInnerHTML={ { __html: cancelButton } }
                    />
                  }
                </div>
              </div>
            </div>
            <div className="backdrop dark" onClick={ onCancel }/>
          </>
          : ''
      }
    </>
  );
}

export default Modal;
