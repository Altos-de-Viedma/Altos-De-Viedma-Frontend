import React from 'react';

import { UI } from '../../../../shared';
import type { LoginFormInputProps } from '../../interfaces';

export const LoginFormInput: React.FC<LoginFormInputProps> = ({ type, label, id, register, error }) => (
  <div className="w-full">
    <UI.Input
      type={ type }
      label={ label }
      variant="bordered"
      size="lg"
      id={ id }
      { ...register( id ) }
      defaultValue=""
      isInvalid={!!error}
      errorMessage={error?.message}
      aria-describedby={error ? `${id}-error` : undefined}
      classNames={{
        input: "focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        inputWrapper: "focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
      }}
    />
    { error?.message && (
      <div
        id={`${id}-error`}
        role="alert"
        aria-live="polite"
        className="text-danger text-sm mt-1"
      >
        { error.message }
      </div>
    )}
  </div>
);