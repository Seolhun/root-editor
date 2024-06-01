import React from 'react';
import clsx from 'clsx';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className, ...rests }: InputProps): JSX.Element {
  return <input {...rests} type="text" className={clsx('Root__Input', className)} />;
}

export { Input };
export default Input;
