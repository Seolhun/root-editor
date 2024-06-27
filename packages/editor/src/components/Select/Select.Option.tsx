import clsx from 'clsx';
import React from 'react';

type ElementProps = React.OptionHTMLAttributes<HTMLOptionElement>;
export type SelectOptionProps = ElementProps;

export function SelectOption({ className, children, value, ...rests }: SelectOptionProps): JSX.Element {
  return (
    <option {...rests} className={clsx('RootEditor__Select__Option', className)} value={value}>
      {children}
    </option>
  );
}
