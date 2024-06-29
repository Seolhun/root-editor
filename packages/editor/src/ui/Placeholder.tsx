import clsx from 'clsx';
import * as React from 'react';

import { EditorClasses } from '~/Editor.theme';

import './Placeholder.scss';

type ElementType = HTMLDivElement;
type ElementProps = React.HTMLAttributes<ElementType>;

export const Placeholder = React.forwardRef<ElementType, ElementProps>(({ className, children, ...others }, ref) => {
  return (
    <div {...others} className={clsx(EditorClasses.placeholder, className)} ref={ref}>
      {children}
    </div>
  );
});
