import React from 'react';
import classNames from 'classnames';

import SelectOption, { SelectOptionProps } from './Select.Option';

type ElementProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export interface SelectProps extends ElementProps {
  options: SelectOptionProps[];
}

function Select({
  onChange,
  className,
  options,
  value,
  ...rests
}: SelectProps): JSX.Element {
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
