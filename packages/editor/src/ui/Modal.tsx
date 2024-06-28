import { FloatingPortal } from '@floating-ui/react';
import { H6 } from '@seolhun/root-ui';
import clsx from 'clsx';
import { ReactNode, useEffect, useRef } from 'react';
import * as React from 'react';

import { useFloatingAreaContext } from '~/context/floating';

import './Modal.scss';

export interface PortalImplProps {
  children: ReactNode;
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
}

function PortalImpl({ children, closeOnClickOutside, onClose, title }: PortalImplProps) {
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
        <H6 className="Modal__title">{title}</H6>
        <button
          aria-label="Close modal"
          className={clsx('Modal__closeButton', 'absolute')}
          onClick={onClose}
          type="button"
        >
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
  if (!floatingElement) {
    return null;
  }

  return (
    <FloatingPortal root={floatingElement}>
      <PortalImpl closeOnClickOutside={closeOnClickOutside} onClose={onClose} title={title}>
        {children}
      </PortalImpl>
    </FloatingPortal>
  );
}
