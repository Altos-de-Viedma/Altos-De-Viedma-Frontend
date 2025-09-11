import { ButtonProps } from '@nextui-org/react';

type VariantType = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';

export type IconButtonProps = {
  
  startContent?:   React.ReactNode;
  type?:           'button' | 'submit' | 'reset';
  variant?:        VariantType;

  onClick?: () =>  void;

} & ButtonProps;