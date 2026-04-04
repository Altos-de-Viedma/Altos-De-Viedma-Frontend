import { useState } from 'react';
import { Input } from '@heroui/react';
import { IoChevronDownOutline, IoCloseOutline } from 'react-icons/io5';
import { SelectModal } from '../select-modal/SelectModal';

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
}

export const SelectConBuscador = ({
  label,
  placeholder = 'Seleccionar...',
  selectedKeys = [],
  onSelectionChange,
  selectionMode = 'single',
  isInvalid = false,
  errorMessage = '',
  className = '',
  options = [],
  isDisabled = false,
  variant = 'bordered',
}: SelectConBuscadorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDisplayValue = () => {
    if (selectedKeys.length === 0) return '';

    if (selectionMode === 'single') {
      const option = options.find(opt => opt.key === selectedKeys[0]);
      return option?.label || '';
    } else {
      if (selectedKeys.length === 1) {
        const option = options.find(opt => opt.key === selectedKeys[0]);
        return option?.label || '';
      }
      return `${selectedKeys.length} elementos seleccionados`;
    }
  };

  const handleSelectionChange = (keys: string[]) => {
    if (selectionMode === 'single') {
      onSelectionChange?.(new Set(keys));
    } else {
      onSelectionChange?.(new Set(keys));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange?.(new Set([]));
  };

  const displayValue = getDisplayValue();

  return (
    <div className={className}>
      <div className="relative">
        <Input
          label={label}
          placeholder={placeholder}
          value={displayValue}
          readOnly
          isInvalid={isInvalid}
          errorMessage={errorMessage}
          isDisabled={isDisabled}
          variant={variant as any}
          className="cursor-pointer"
          classNames={{
            input: "cursor-pointer",
            inputWrapper: "cursor-pointer hover:border-primary-300 transition-colors"
          }}
          endContent={
            <div className="flex items-center gap-1">
              {selectedKeys.length > 0 && !isDisabled && (
                <button
                  onClick={handleClear}
                  className="text-default-400 hover:text-default-600 p-1"
                  type="button"
                >
                  <IoCloseOutline size={16} />
                </button>
              )}
              <IoChevronDownOutline
                size={16}
                className={`text-default-400 transition-transform ${isModalOpen ? 'rotate-180' : ''}`}
              />
            </div>
          }
          onClick={() => !isDisabled && setIsModalOpen(true)}
        />
      </div>

      <SelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={label || 'Seleccionar'}
        options={options}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
        selectionMode={selectionMode}
        searchPlaceholder="Buscar..."
      />
    </div>
  );
};