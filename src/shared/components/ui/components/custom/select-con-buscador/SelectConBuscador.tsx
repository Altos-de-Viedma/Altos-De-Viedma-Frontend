import { useState, useMemo, useCallback } from 'react';
import { Select, SelectItem, Input } from '@heroui/react';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';

interface SelectConBuscadorProps {
  label?: string;
  placeholder?: string;
  selectedKeys?: string[];
  onSelectionChange?: (keys: any) => void;
  size?: 'sm' | 'md' | 'lg';
  selectionMode?: 'single' | 'multiple';
  isInvalid?: boolean;
  errorMessage?: string;
  className?: string;
  options: Array<{
    key: string;
    label: string;
    description?: string;
    [key: string]: any;
  }>;
  defaultSelectedKeys?: string[];
  isDisabled?: boolean;
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  classNames?: {
    trigger?: string;
    value?: string;
    listbox?: string;
  };
}

export const SelectConBuscador = ({
  label,
  placeholder = 'Buscar...',
  selectedKeys = [],
  onSelectionChange,
  size = 'md',
  selectionMode = 'single',
  isInvalid = false,
  errorMessage = '',
  className = 'max-w-xs',
  options = [],
  defaultSelectedKeys,
  isDisabled = false,
  variant = 'bordered',
  color = 'default',
  classNames,
}: SelectConBuscadorProps) => {
  const [searchValue, setSearchValue] = useState('');

  // Búsqueda ultra inteligente en todas las propiedades
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return options;

    const searchLower = searchValue.toLowerCase().trim();

    return options.filter((option) => {
      const valuesToSearch = [
        option.label,
        option.description,
        option.key,
        ...Object.values(option).filter(v => typeof v === 'string')
      ].filter(Boolean).map(v => String(v).toLowerCase());

      return valuesToSearch.some(v => v.includes(searchLower));
    });
  }, [options, searchValue]);

  const handleSelectionChange = useCallback(
    (keys: any) => {
      setSearchValue('');
      onSelectionChange?.(keys);
    },
    [onSelectionChange]
  );

  return (
    <Select
      label={label}
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      size={size as any}
      selectionMode={selectionMode}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      className={className}
      defaultSelectedKeys={defaultSelectedKeys}
      isDisabled={isDisabled}
      variant={variant as any}
      color={color as any}
      classNames={{
        ...classNames,
        trigger: 'min-h-[48px] ' + (classNames?.trigger || ''),
        value: 'text-default-500 ' + (classNames?.value || ''),
        listbox: 'p-0 ' + (classNames?.listbox || ''),
      }}
    >
      {() => (
          <>
            {/* Buscador fijo en la parte superior */}
            <div
              className="sticky top-0 z-50 bg-background p-2 border-b border-default-200 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Input
                autoFocus
                size="sm"
                placeholder="🔍 Escribe para buscar..."
                startContent={<IoSearchOutline className="text-default-400" />}
                endContent={
                  searchValue ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchValue('');
                      }}
                      className="text-default-400 hover:text-default-600"
                      type="button"
                    >
                      <IoCloseOutline size={16} />
                    </button>
                  ) : null
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full"
                classNames={{
                  input: 'text-small',
                  inputWrapper: 'h-[40px] bg-default-100 hover:bg-default-200 transition-colors',
                }}
              />
              {searchValue && (
                <div className="text-xs text-default-400 mt-1 px-1">
                  Buscando: "<span className="text-primary font-medium">{searchValue}</span>"
                  {filteredOptions.length} resultado{filteredOptions.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Opciones filtradas */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem
                  key={option.key}
                  textValue={option.label}
                  className="py-2 hover:bg-default-100"
                  description={option.description}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-small font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-tiny text-default-400">{option.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="py-6 px-3 text-center">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-default-400 text-small">
                  No se encontraron resultados para
                </p>
                <p className="text-primary font-medium text-small">"{searchValue}"</p>
                <p className="text-default-400 text-tiny mt-2">
                  Intenta con otra búsqueda
                </p>
              </div>
            )}
          </>
        )}
      </Select>
  );
};
