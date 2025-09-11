import { FieldErrors, UseFormRegister } from 'react-hook-form';


export interface GenericInputProps {
  label:         string;
  name:          string;
  defaultValue?: string;
  className?:    string;

  register:      UseFormRegister<any>;
  errors:        FieldErrors;

  type:          'text' | 'number' | 'email' | 'password';
  variant?:      'bordered' | 'flat' | 'underlined';
  size?:         'sm' | 'md' | 'lg';
}