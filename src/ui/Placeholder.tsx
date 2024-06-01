import { ReactNode } from 'react';
import * as React from 'react';

import './Placeholder.css';

export default function Placeholder({ className, children }: { children: ReactNode; className?: string }): JSX.Element {
  return <div className={className || 'Placeholder__root'}>{children}</div>;
}
