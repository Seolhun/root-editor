import clsx from 'clsx';
import React from 'react';

import { FormItem, FormLabel, Input, InputProps } from '~/components';

type TextFieldProps = InputProps;

function TextField({ id, className, children, ...rests }: TextFieldProps): JSX.Element {
  return (
    <FormItem className="TextField__Wrapper">
      <FormLabel className="TextField__Label" htmlFor={id}>
        {children}
      </FormLabel>
      <Input {...rests} className={clsx('TextField__Input', className)} id={id} type="text" />
    </FormItem>
  );
}

export { TextField };
export default TextField;
