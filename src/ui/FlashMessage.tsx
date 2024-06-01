import * as React from 'react';
import { createPortal } from 'react-dom';

import './FlashMessage.css';

export interface FlashMessageProps {
  children: React.ReactNode;
}

export default function FlashMessage({ children }: FlashMessageProps): JSX.Element {
  return createPortal(
    <div className="FlashMessage__overlay" role="dialog">
      <p className="FlashMessage__alert" role="alert">
        {children}
      </p>
    </div>,
    document.body,
  );
}
