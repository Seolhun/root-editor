import { FloatingPortal } from '@floating-ui/react';
import * as React from 'react';

import { useFloatingAreaContext } from '~/context/floating';

import './FlashMessage.scss';

export interface FlashMessageProps {
  children: React.ReactNode;
}

export default function FlashMessage({ children }: FlashMessageProps) {
  const { floatingElement } = useFloatingAreaContext();

  if (!floatingElement) {
    return null;
  }

  return (
    <FloatingPortal root={floatingElement}>
      <div className="FlashMessage__overlay" role="dialog">
        <p className="FlashMessage__alert" role="alert">
          {children}
        </p>
      </div>
    </FloatingPortal>
  );
}
