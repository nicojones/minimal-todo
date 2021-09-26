import React from "react";
import { PDefault } from "../../interfaces";

interface ModalAttrs {
  children: any;
  modalOpen: boolean;
  okButton: string;
  cancelButton: string;
  onAccept: (event: PDefault) => any;
  onCancel: (event: PDefault) => any;
  loading: boolean;
}
export const Modal = ({
  children,
  modalOpen,
  okButton,
  cancelButton,
  onAccept,
  onCancel,
  loading,
}: ModalAttrs) =>
  modalOpen ? (
    <>
      <div className={"modal"}>
        <div className={loading ? " loader-input cover" : ""}>
          <div className="modal-content">{children}</div>
          <div className="modal-footer">
            {okButton && (
              <button
                onClick={onAccept}
                className="modal-close waves-effect waves-green btn"
                dangerouslySetInnerHTML={{ __html: okButton }}
              />
            )}
            {cancelButton && (
              <button
                onClick={onCancel}
                className="modal-close waves-effect waves-red btn left"
                dangerouslySetInnerHTML={{ __html: cancelButton }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="backdrop dark" onClick={onCancel} />
    </>
  ) : (
    null
  );
