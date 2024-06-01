import React from 'react';
import { createPortal } from 'react-dom';

function PortalImpl({
  children,
  closeOnClickOutside,
  onClose,
  title,
}: {
  children: (JSX.Element | string)[] | JSX.Element | string;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
}) {
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current?.focus();
    }
  }, []);

  React.useEffect(() => {
    let modalOverlayElement: HTMLDivElement | null = null;
    const handler = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const { target } = event;
      if (modalRef.current !== null && !modalRef.current?.contains(target as Node) && closeOnClickOutside) {
        onClose();
      }
    };
    if (modalRef.current !== null) {
      modalOverlayElement = modalRef.current?.parentElement as HTMLDivElement | null;
      if (modalOverlayElement !== null) {
        modalOverlayElement?.addEventListener('click', clickOutsideHandler);
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div className="Modal__overlay" role="dialog">
      <div className="Modal__modal" ref={modalRef} tabIndex={-1}>
        <h2 className="Modal__title">{title}</h2>
        <button aria-label="Close modal" className="Modal__closeButton" onClick={onClose} type="button">
          X
        </button>
        <div className="Modal__content">{children}</div>
      </div>
    </div>
  );
}

function Modal({
  children,
  closeOnClickOutside = false,
  onClose,
  title,
}: {
  children: (JSX.Element | string)[] | JSX.Element | string;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
}): JSX.Element {
  return createPortal(
    <PortalImpl closeOnClickOutside={closeOnClickOutside} onClose={onClose} title={title}>
      {children}
    </PortalImpl>,
    document.body,
  );
}

export { Modal };
export default Modal;
