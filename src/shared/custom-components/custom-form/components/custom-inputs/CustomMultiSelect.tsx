import { useController } from 'react-hook-form';


import { CustomMultiSelectProps } from './interfaces';
import { UI } from '../../../../components';

export const CustomMultiSelect = ( {
  options,
  label = "Seleccione opciones",
  className = "",
  selectionMode = "multiple",
  defaultSelectedKeys,
  name,
  control,
  ...props
}: CustomMultiSelectProps ) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error }
  } = useController( {
    name,
    control,
    defaultValue: defaultSelectedKeys || []
  } );

  return (
    <UI.Select
      ref={ ref }
      label={ label }
      className={ `max-w-xs ${ className }` }
      selectionMode={ selectionMode }
      defaultSelectedKeys={ defaultSelectedKeys }
      value={ value }
      onSelectionChange={ ( keys ) => onChange( Array.from( keys ) ) }
      isInvalid={ !!error }
      errorMessage={ error?.message }
      { ...props }
    >
      { options.map( ( { key, label } ) => (
        <UI.SelectItem key={ key }>{ label }</UI.SelectItem>
      ) ) }
    </UI.Select>
  );
};