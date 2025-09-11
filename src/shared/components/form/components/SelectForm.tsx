import { useEffect, useMemo } from 'react';
import { Controller, FieldValues, PathValue } from 'react-hook-form';

import { UI } from '../../ui';
import type { ControlledSelectProps } from '../interfaces';

interface ExtendedOption {
  key: string;
  label: string;
  isAction?: boolean;
  isSeparator?: boolean;
}

export const SelectForm = <T extends FieldValues>( {
  name,
  control,
  label,
  placeholder,
  options,
  errors,
  size = "md",
  selectionMode = "single",
  defaultSelectedKeys
}: ControlledSelectProps<T> ) => {
  const allOptions = useMemo<ExtendedOption[]>( () => {
    if ( selectionMode === "multiple" ) {
      return [
        { key: "selectAll", label: "Seleccionar todos", isAction: true },
        { key: "deselectAll", label: "Deseleccionar todos", isAction: true },
        { key: "separator", label: "", isSeparator: true },
        ...options.map( option => ( { ...option, isAction: false, isSeparator: false } ) )
      ];
    }
    return options.map( option => ( { ...option, isAction: false, isSeparator: false } ) );
  }, [ options, selectionMode ] );

  return (
    <Controller
      name={ name }
      control={ control }
      defaultValue={ defaultSelectedKeys as PathValue<T, typeof name> }
      render={ ( { field } ) => {
        useEffect( () => {
          if ( defaultSelectedKeys && defaultSelectedKeys.length > 0 ) {
            field.onChange( defaultSelectedKeys );
          }
        }, [] );

        const handleSelectionChange = ( keys: any ) => {
          if ( selectionMode === "multiple" ) {
            const selectedKeys = Array.from( keys ) as string[];
            if ( selectedKeys.includes( "selectAll" ) ) {
              field.onChange( options.map( option => option.key ) );
            } else if ( selectedKeys.includes( "deselectAll" ) ) {
              field.onChange( [] );
            } else {
              field.onChange( selectedKeys );
            }
          } else {
            field.onChange( Array.from( keys ) as PathValue<T, typeof name> );
          }
        };

        return (
          <UI.Select
            label={ label }
            placeholder={ placeholder }
            selectedKeys={ field.value ? new Set( field.value ) : new Set() }
            onSelectionChange={ handleSelectionChange }
            size={ size as any }
            selectionMode={ selectionMode }
            isInvalid={ !!errors[ name ] }
            errorMessage={ errors[ name ]?.message as string }
            className="max-w-xs"
          >
            { allOptions.map( ( option ) => {
              if ( option.isSeparator ) {
                return (
                  <UI.SelectItem key={ option.key } textValue="Separator" className="h-px bg-gray-300 my-2">
                    <span className="sr-only">Separator</span>
                  </UI.SelectItem>
                );
              }
              return (
                <UI.SelectItem
                  key={ option.key }
                  value={ option.key }
                  textValue={ option.label }
                  className={ option.isAction ? "font-semibold text-primary" : "" }
                >
                  { option.label }
                </UI.SelectItem>
              );
            } ) }
          </UI.Select>
        );
      } }
    />
  );
};