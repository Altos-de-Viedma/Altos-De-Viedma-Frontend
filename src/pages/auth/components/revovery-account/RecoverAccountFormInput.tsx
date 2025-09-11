import React from 'react';

import { UI } from '../../../../shared';
import type { RecoverAccountFormInputProps } from '../../interfaces';


export const RecoverAccountFormInput: React.FC<RecoverAccountFormInputProps> = ({ type, label, id, register, error }) => (
  <>
    <UI.Input
      type={ type }
      label={ label }
      variant="bordered"
      size="lg"
      id={ id }
      { ...register( id ) }
      defaultValue=""
    />
    { error?.message && <span className="text-danger">{ error.message }</span> }
  </>
);