import clsx from 'clsx';
import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className, ...rests }: InputProps): JSX.Element {
  return <input {...rests} className={clsx('Root__Input', className)} type="text" />;
}

export { Input };
export default Input;
