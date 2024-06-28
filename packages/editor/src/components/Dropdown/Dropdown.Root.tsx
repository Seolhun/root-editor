import React from 'react';

import { Opener, useFloatingAreaContext } from '~/context/floating';

import { DropdownContextProvider } from './Dropdown.Context';

export interface DropdownProps {
  children: React.ReactNode;
}

export function DropdownRoot({ children }: DropdownProps) {
  const { floatingElement } = useFloatingAreaContext();

  if (!floatingElement) {
    return null;
  }

  return (
    <Opener root={floatingElement}>
      <DropdownContextProvider>{children}</DropdownContextProvider>
    </Opener>
  );
}
