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

  // Crear items con el buscador incluido
  const items = useMemo(() => {
    const allItems = [
      // Item especial para el buscador (no seleccionable)
      { key: '___searchBox___', label: '___SearchBox___', isSearchBox: true },
      // Opciones filtradas
      ...filteredOptions,
    ];
    
    // Si no hay resultados, agregar item de no resultados
    if (filteredOptions.length === 0 && searchValue.trim()) {
      allItems.push({ key: '___NoResults___', label: '___NoResults___', isNoResults: true });
    }
    
    return allItems;
  }, [filteredOptions, searchValue]);

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
      items={items}
    >
      {(item) => {
        // Renderizar el buscador
        if ((item as any).isSearchBox) {
          return (
            <SelectItem
              key="search-box"
              className="sticky top-0 z-50 bg-background p-2 border-b border-default-200 shadow-sm"
              textValue="Buscar"
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
                        e.preventDefault();
                        setSearchValue('');
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
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
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="w-full"
                classNames={{
                  input: 'text-small pointer-events-auto',
                  inputWrapper: 'h-[40px] bg-default-100 hover:bg-default-200 transition-colors pointer-events-auto',
                }}
              />
              {searchValue && (
                <div className="text-xs text-default-400 mt-1 px-1">
                  Buscando: "<span className="text-primary font-medium">{searchValue}</span>" - {filteredOptions.length} resultado{filteredOptions.length !== 1 ? 's' : ''}
                </div>
              )}
            </SelectItem>
          );
        }

        // Renderizar mensaje de no resultados
        if ((item as any).isNoResults) {
          return (
            <SelectItem
              key="no-results"
              className="py-6 px-3 text-center cursor-default pointer-events-none"
              textValue="No hay resultados"
            >
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-default-400 text-small">
                No se encontraron resultados para
              </p>
              <p className="text-primary font-medium text-small">"{searchValue}"</p>
              <p className="text-default-400 text-tiny mt-2">
                Intenta con otra búsqueda
              </p>
            </SelectItem>
          );
        }

        // Renderizar opciones normales
        return (
          <SelectItem
            key={item.key}
            textValue={item.label}
            className="py-2 hover:bg-default-100"
            description={item.description}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-small font-medium">{item.label}</span>
              {item.description && (
                <span className="text-tiny text-default-400">{item.description}</span>
              )}
            </div>
          </SelectItem>
        );
      }}
    </Select>
  );
};
