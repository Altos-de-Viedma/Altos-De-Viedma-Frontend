import { Control } from 'react-hook-form';

export interface CustomSelectProps {
  label?:        string;
  className?:    string;
  defaultValue?: string;
  name:          string;
  
  control:       Control<any>;
  options:       { key: string; label: string; }[];
  [ key: string ]: any;
}