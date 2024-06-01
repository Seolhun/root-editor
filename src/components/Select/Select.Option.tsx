import clsx from 'clsx';
import React from 'react';

type ElementProps = React.OptionHTMLAttributes<HTMLOptionElement>;
export type SelectOptionProps = ElementProps;

function SelectOption({ className, children, value, ...rests }: SelectOptionProps): JSX.Element {
  return (
    <option {...rests} className={clsx('Root__Editor__Select__Option', className)} value={value}>
      {children}
    </option>
  );
}
export { SelectOption };
export default SelectOption;
