import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';

import { CustomInput, CustomMultiSelect, CustomSelect } from '../components';
import { ICustomFieldConfig } from '../interfaces';

export const useRenderField = (
  register: UseFormRegister<any>,
  errors: FieldErrors<any>,
  control: Control<any, any>
) => {
  return ( field: ICustomFieldConfig ) => {
    switch ( field.type ) {
      case 'text':
      case 'number':
        return (
          <CustomInput
            type={ field.type }
            label={ field.label }
            name={ field.name }
            register={ register }
            errors={ errors }
            defaultValue={ field.defaultValue as string | undefined }
            className={ field.className || '' }
          />
        );

      case 'select':
        return (
          <CustomSelect
            options={ field.options || [] }
            label={ field.label }
            name={ field.name }
            register={ register }
            errors={ errors }
            control={ control }
            defaultValue={ field.defaultValue as string | undefined }
            className={ field.className || '' }
          />
        );

      case 'multiSelect':
        return (
          <CustomMultiSelect
            options={ field.options || [] }
            label={ field.label }
            name={ field.name }
            control={ control }
            defaultSelectedKeys={ field.defaultValue as string[] | undefined }
            className={ field.className || '' }
          />
        );

      default:
        return null;
    }
  };
};