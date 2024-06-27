import * as React from 'react';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useFloatingAreaContext } from '~/components';
import { useClientReady } from '~/hooks/useClientReady';

import './Modal.scss';

function PortalImpl({
  children,
  closeOnClickOutside,
  onClose,
  title,
}: {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (modalRef.current !== null && !modalRef.current.contains(target as Node) && closeOnClickOutside) {
        onClose();
      }
    };
    const modelElement = modalRef.current;
    if (modelElement !== null) {
      modalOverlayElement = modelElement.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement.addEventListener('click', clickOutsideHandler);
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

export interface ModalProps {
  children: ReactNode;
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({ children, closeOnClickOutside = false, onClose, title }: ModalProps) {
  const { floatingElement } = useFloatingAreaContext();
  const isClientReady = useClientReady();
  if (!isClientReady) {
    return null;
  }

  return createPortal(
    <PortalImpl closeOnClickOutside={closeOnClickOutside} onClose={onClose} title={title}>
      {children}
    </PortalImpl>,
    floatingElement,
  );
}
