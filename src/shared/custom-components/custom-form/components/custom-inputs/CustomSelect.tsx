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
    <div className="w-full max-w-md mx-auto sm:max-w-none">
      <UI.Select
        ref={ ref }
        label={ label }
        className={ `w-full ${ className }` }
        defaultSelectedKeys={ defaultValue ? [ defaultValue ] : undefined }
        value={ value }
        onSelectionChange={ ( keys ) => onChange( Array.from( keys )[ 0 ] ) }
        isInvalid={ !!error }
        errorMessage={ error?.message }
        size="lg"
        variant="bordered"
        classNames={{
          base: "w-full",
          mainWrapper: "w-full",
          trigger: [
            "glass-effect",
            "border border-gray-200/50 dark:border-gray-700/50",
            "hover:border-primary-500/50",
            "focus:border-primary-500",
            "transition-all duration-300",
            "shadow-soft hover:shadow-medium",
            "min-h-[3rem] sm:min-h-[3.5rem]",
            "px-3 sm:px-4",
            "rounded-lg sm:rounded-xl",
            "bg-white dark:bg-gray-800"
          ].join(" "),
          value: [
            "text-foreground",
            "responsive-text-sm sm:responsive-text-base",
            "text-center sm:text-left"
          ].join(" "),
          label: [
            "text-foreground/70",
            "font-medium",
            "responsive-text-sm",
            "text-center sm:text-left",
            error ? "text-danger-500" : "group-focus-within:text-primary-500",
            "transition-colors duration-200"
          ].filter(Boolean).join(" "),
          listbox: [
            "bg-white dark:bg-gray-800",
            "border border-gray-200/50 dark:border-gray-700/50",
            "shadow-lg",
            "rounded-lg sm:rounded-xl",
            "max-h-[60vh] overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
            "scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
          ].join(" "),
          popoverContent: [
            "p-0",
            "max-w-[90vw] sm:max-w-md",
            "rounded-lg sm:rounded-xl"
          ].join(" "),
          errorMessage: "text-danger-500 responsive-text-xs font-medium text-center sm:text-left mt-1"
        }}
        { ...props }
      >
        { options.map( ( { key, label } ) => (
          <UI.SelectItem
            key={ key }
            classNames={{
              base: [
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:bg-primary-50 dark:focus:bg-primary-900/20",
                "transition-colors duration-200",
                "px-3 sm:px-4 py-2 sm:py-3",
                "responsive-text-sm sm:responsive-text-base"
              ].join(" ")
            }}
          >
            { label }
          </UI.SelectItem>
        ) ) }
      </UI.Select>
    </div>
  );
};