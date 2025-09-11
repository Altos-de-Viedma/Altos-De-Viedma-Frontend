import { Control } from 'react-hook-form';

import { UI } from '../../../../../components';




export interface SelectOption {
  key:   string;
  label: string;
}

export interface CustomMultiSelectProps extends Omit<UI.SelectProps, 'children'> {
  label?:  string;
  name:    string;

  options: SelectOption[];
  control: Control<any>;
}
