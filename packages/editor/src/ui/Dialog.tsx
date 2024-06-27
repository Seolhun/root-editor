import { ReactNode } from 'react';
import * as React from 'react';

import './Dialog.scss';

type Props = Readonly<{
  children: ReactNode;
  'data-test-id'?: string;
}>;

export function DialogButtonsList({ children }: Props): JSX.Element {
  return <div className="DialogButtonsList">{children}</div>;
}

export function DialogActions({ children, 'data-test-id': dataTestId }: Props): JSX.Element {
  return (
    <div className="DialogActions" data-test-id={dataTestId}>
      {children}
    </div>
  );
}
