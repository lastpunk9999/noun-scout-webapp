import React, { Children, ReactNode } from "react";
import { Request } from "../types";
type ModalProps = {
  modalContent: ReactNode;
  setShowModal: Function;
};

export default function Modal(props: ModalProps) {
  return (
    <>
      <div className="w-full justify-center items-center flex flex-col overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <button
          className="text-white font-bold text-2xl w-full max-w-md"
          onClick={() => props.setShowModal(false)}
        >
          <span className="text-3xl block w-full text-right opacity-85 hover:opacity-100">
            &times;
          </span>
        </button>
        <div className="w-full max-w-md">{props.modalContent}</div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
