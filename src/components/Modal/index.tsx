import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

import { usePrevious } from "../../hooks/usePrevious";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  children: React.ReactNode;
}

export function Modal(props: ModalProps) {
  const [modalStatus, setModalStatus] = useState(props.isOpen);
  const previousOpen = usePrevious(props.isOpen);

  useEffect(() => {
    if (previousOpen !== props.isOpen) {
      setModalStatus(props.isOpen);
    }
  }, [props.isOpen, previousOpen]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={props.setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
     {props.children}
    </ReactModal>
  )
}
