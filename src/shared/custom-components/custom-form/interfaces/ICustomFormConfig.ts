import { z } from 'zod';

export interface ICustomFieldConfig {
  type:          'text' | 'number' | 'select' | 'multiSelect';
  label:         string;
  name:          string;
  className?:    string;
  defaultValue?: unknown;
  options?:      { key: string; label: string; }[];
}

export interface ICustomFormConfig {
  fields: ICustomFieldConfig[];
  schema: z.ZodType<unknown>;
  title:  string;
}

export interface IGenericCustomFormProps {
  id?:      string;
  config:   ICustomFormConfig;
  onSubmit: ( data: any ) => void;
}