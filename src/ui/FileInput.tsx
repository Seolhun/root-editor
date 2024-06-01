import * as React from 'react';

import './Input.css';

type Props = Readonly<{
  accept?: string;
  'data-test-id'?: string;
  label: string;
  onChange: (files: FileList | null) => void;
}>;

export default function FileInput({ accept, 'data-test-id': dataTestId, label, onChange }: Props): JSX.Element {
  return (
    <div className="Input__wrapper">
      <label className="Input__label">{label}</label>
      <input
        accept={accept}
        className="Input__input"
        data-test-id={dataTestId}
        onChange={(e) => onChange(e.target.files)}
        type="file"
      />
    </div>
  );
}
