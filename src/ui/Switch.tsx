import * as React from 'react';
import { useMemo } from 'react';

export default function Switch({
  id,
  checked,
  onClick,
  text,
}: Readonly<{
  checked: boolean;
  id?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}>): JSX.Element {
  const buttonId = useMemo(() => 'id_' + Math.floor(Math.random() * 10000), []);
  return (
    <div className="switch" id={id}>
      <label htmlFor={buttonId}>{text}</label>
      <button aria-checked={checked} id={buttonId} onClick={onClick} role="switch">
        <span />
      </button>
    </div>
  );
}
