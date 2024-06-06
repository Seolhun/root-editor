import * as React from 'react';
import { createPortal } from 'react-dom';

import { useFloatingAreaContext } from '~/context/floating';
import { useClientReady } from '~/hooks/useClientReady';

import './FlashMessage.scss';

export interface FlashMessageProps {
  children: React.ReactNode;
}

export default function FlashMessage({ children }: FlashMessageProps) {
  const { floatingElement } = useFloatingAreaContext();
  const isClientReady = useClientReady();

  if (!isClientReady) {
    return null;
  }

  return createPortal(
    <div className="FlashMessage__overlay" role="dialog">
      <p className="FlashMessage__alert" role="alert">
        {children}
      </p>
    </div>,
    floatingElement,
  );
}
