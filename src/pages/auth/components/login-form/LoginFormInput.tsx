import React from 'react';

import { UI } from '../../../../shared';
import type { LoginFormInputProps } from '../../interfaces';

export const LoginFormInput: React.FC<LoginFormInputProps> = ({ type, label, id, register, error }) => (
  <div className="w-full max-w-sm mx-auto">
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
      className="w-full"
      classNames={{
        base: "w-full",
        mainWrapper: "w-full",
        inputWrapper: [
          "w-full",
          "bg-white dark:bg-gray-800",
          "border-2 border-gray-300 dark:border-gray-600",
          "hover:border-gray-400 dark:hover:border-gray-500",
          "focus-within:border-primary-500 dark:focus-within:border-primary-400",
          "focus-within:ring-2 focus-within:ring-primary-500/20",
          "transition-all duration-200 ease-in-out",
          "rounded-lg",
          "shadow-sm hover:shadow-md",
          "min-h-[3.5rem] sm:min-h-[4rem]",
          "px-4 py-3"
        ],
        input: [
          "responsive-text-base",
          "text-gray-900 dark:text-gray-100",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          "px-0 py-0",
          "text-center sm:text-left"
        ],
        label: [
          "responsive-text-sm",
          "text-gray-700 dark:text-gray-300",
          "font-medium",
          "text-center sm:text-left"
        ]
      }}
    />
    { error?.message && (
      <div
        id={`${id}-error`}
        role="alert"
        aria-live="polite"
        className="text-danger responsive-text-xs mt-2 px-1 text-center"
      >
        { error.message }
      </div>
    )}
  </div>
);