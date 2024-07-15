import * as React from 'react';

import { OpenerOptions } from './Opener.types';
import { OpenerContext, useOpener } from './useOpenerContext';

export interface OpenerProps extends OpenerOptions {
  children: React.ReactNode;
}

export const OpenerRoot = ({ children, ...options }: OpenerProps) => {
  const tooltipValues = useOpener(options);

  return <OpenerContext.Provider value={tooltipValues}>{children}</OpenerContext.Provider>;
};
