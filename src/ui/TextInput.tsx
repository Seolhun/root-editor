import { HTMLInputTypeAttribute } from 'react';
import * as React from 'react';

import './Input.scss';

type TextInputProps = Readonly<{
  'data-test-id'?: string;
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
}>;

export default function TextInput({
  type = 'text',
  'data-test-id': dataTestId,
  label,
  onChange,
  placeholder = '',
  value,
}: TextInputProps): JSX.Element {
  return (
    <div className="Input__wrapper">
      <label className="Input__label">{label}</label>
      <input
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className="Input__input"
        data-test-id={dataTestId}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  );
}
