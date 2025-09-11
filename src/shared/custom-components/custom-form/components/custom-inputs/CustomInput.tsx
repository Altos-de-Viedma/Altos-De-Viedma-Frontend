
import { UI } from '../../../../components';
import { GenericInputProps } from './interfaces';

export const CustomInput: React.FC<GenericInputProps> = ( {
  type,
  label,
  name,
  register,
  errors,
  defaultValue = '',
  variant = 'bordered',
  size = 'lg',
  className = ''
} ) => {
  return (
    <UI.Input
      type={ type }
      label={ label }
      variant={ variant }
      size={ size }
      id={ name }
      { ...register( name ) }
      defaultValue={ defaultValue }
      isInvalid={ !!errors[ name ]?.message }
      errorMessage={ errors[ name ]?.message as string }
      className={ className }
    />
  );
};