import React from 'react';

import { UI } from '../../../../shared';
import type { LoginFormInputProps } from '../../interfaces';

export const LoginFormInput: React.FC<LoginFormInputProps> = ({ type, label, id, register, error }) => (
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