import { useController } from 'react-hook-form';


import { CustomSelectProps } from './interfaces';
import { UI } from '../../../../components';

export const CustomSelect = ( {
  options,
  label = "Seleccione una opción",
  className = "",
  defaultValue,
  name,
  control,
  ...props
}: CustomSelectProps ) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error }
  } = useController( {
    name,
    control,
    defaultValue: defaultValue || ''
  } );

  return (
    <UI.Select
      ref={ ref }
      label={ label }
      className={ `max-w-xs ${ className }` }
      defaultSelectedKeys={ defaultValue ? [ defaultValue ] : undefined }
      value={ value }
      onSelectionChange={ ( keys ) => onChange( Array.from( keys )[ 0 ] ) }
      isInvalid={ !!error }
      errorMessage={ error?.message }
      { ...props }
    >
      { options.map( ( { key, label } ) => (
        <UI.SelectItem key={ key } value={ key }>{ label }</UI.SelectItem>
      ) ) }
    </UI.Select>
  );
};