import React from 'react';
import classNames from 'classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className, ...rests }: InputProps): JSX.Element {
  return <input {...rests} type="text" className={classNames('Root__Input', className)} />;
}

export { Input };
export default Input;
