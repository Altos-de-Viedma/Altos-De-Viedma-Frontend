import { UseFormRegister } from 'react-hook-form';

import { recoveryAccountInputs } from '../validations';



export type LoginInputs = {
  username:    string;
  password:    string;
};

export interface LoginFormInputProps {
  type:     string;
  label:    string;
  id:       keyof LoginInputs;
  register: UseFormRegister<LoginInputs>;
  error?:   { message?: string };
}

export interface ForgotPasswordLinkProps {
  onClick: () => void;
}

export interface RecoverAccountFormInputProps {
  type:     string;
  label:    string;
  id:       keyof recoveryAccountInputs;
  register: UseFormRegister<recoveryAccountInputs>;
  error?:   { message?: string };
}