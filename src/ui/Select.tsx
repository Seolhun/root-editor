import * as React from 'react';

import './Select.css';

type SelectIntrinsicProps = JSX.IntrinsicElements['select'];
interface SelectProps extends SelectIntrinsicProps {
  label: string;
}

export default function Select({ className, children, label, ...other }: SelectProps): JSX.Element {
  return (
    <div className="Input__wrapper">
      <label className="Input__label" style={{ marginTop: '-1em' }}>
        {label}
      </label>
      <select {...other} className={className || 'select'}>
        {children}
      </select>
    </div>
  );
}
