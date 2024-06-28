import React from 'react';

import { Opener, OpenerOptions, useFloatingAreaContext } from '~/context/floating';
import { ElementRef } from '~/types';

import { DropdownContextProvider } from './Dropdown.Context';

export interface DropdownProps {
  children: React.ReactNode;
  placement?: OpenerOptions['placement'];
  root?: ElementRef<HTMLButtonElement>;
  strategy?: OpenerOptions['strategy'];
}

export function DropdownRoot({ children, placement, root }: DropdownProps) {
  const { floatingElement } = useFloatingAreaContext();

  if (!floatingElement) {
    return null;
  }

  return (
    <Opener placement={placement} root={root || floatingElement}>
      <DropdownContextProvider>{children}</DropdownContextProvider>
    </Opener>
  );
}
