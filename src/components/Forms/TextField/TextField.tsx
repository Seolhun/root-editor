import React from 'react';
import classNames from 'classnames';

import { FormItem, FormLabel, Input, InputProps } from '@/components';

type TextFieldProps = InputProps;

function TextField({ children, id, className, ...rests }: TextFieldProps): JSX.Element {
  return (
    <FormItem className="TextField__Wrapper">
      <FormLabel htmlFor={id} className="TextField__Label">
        {children}
      </FormLabel>
      <Input {...rests} id={id} type="text" className={classNames('TextField__Input', className)} />
    </FormItem>
  );
}

export { TextField };
export default TextField;
