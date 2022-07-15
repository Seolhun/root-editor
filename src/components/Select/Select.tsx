import React from 'react';
import classNames from 'classnames';

import SelectOption, { SelectOptionProps } from './Select.Option';

export interface SelectProps {
  options: SelectOptionProps[];
}

type ElementProps = React.SelectHTMLAttributes<HTMLSelectElement>;
function Select({
  onChange,
  className,
  options,
  value,
  ...rests
}: SelectProps & ElementProps): JSX.Element {
  return (
    <select
      {...rests}
      className={classNames('Root__Editor__Select', className)}
      onChange={onChange}
      value={value}
    >
      {options.map((selectOptionProps, i) => (
        <SelectOption key={i} {...selectOptionProps}>
          {selectOptionProps?.children || selectOptionProps?.value}
        </SelectOption>
      ))}
    </select>
  );
}
export { Select };
export default Select;
