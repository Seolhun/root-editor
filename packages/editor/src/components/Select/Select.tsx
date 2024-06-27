import clsx from 'clsx';
import React from 'react';

import { SelectOption, SelectOptionProps } from './Select.Option';

type ElementProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export interface SelectProps extends ElementProps {
  options: SelectOptionProps[];
}

export function Select({ className, onChange, options, value, ...rests }: SelectProps): JSX.Element {
  return (
    <select {...rests} className={clsx('RootEditor__Select', className)} onChange={onChange} value={value}>
      {options.map((selectOptionProps, i) => (
        <SelectOption key={i} {...selectOptionProps}>
          {selectOptionProps?.children || selectOptionProps?.value}
        </SelectOption>
      ))}
    </select>
  );
}
