import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ReactNode } from 'react';

export interface GenericInputProps {
  label: string;
  name: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  description?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;

  register: UseFormRegister<any>;
  errors: FieldErrors;

  type: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' | 'search';
  variant?: 'bordered' | 'flat' | 'underlined' | 'faded';
  size?: 'sm' | 'md' | 'lg';
}