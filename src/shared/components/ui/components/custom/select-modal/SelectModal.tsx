import { useState, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, Chip } from '@heroui/react';
import { IoSearchOutline, IoCloseOutline, IoCheckmarkOutline } from 'react-icons/io5';

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  placeholder?: string;
  options: Array<{
    key: string;
    label: string;
    description?: string;
  }>;
  selectedKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  selectionMode?: 'single' | 'multiple';
  searchPlaceholder?: string;
}

export const SelectModal = ({
  isOpen,
  onClose,
  title,
  options,
  selectedKeys,
  onSelectionChange,
  selectionMode = 'single',
  searchPlaceholder = "Buscar..."
}: SelectModalProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [tempSelectedKeys, setTempSelectedKeys] = useState<string[]>(selectedKeys);

  // Filtrar opciones basado en la búsqueda
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return options;

    const searchLower = searchValue.toLowerCase().trim();
    return options.filter(option =>
      option.label.toLowerCase().includes(searchLower) ||
      option.description?.toLowerCase().includes(searchLower) ||
      option.key.toLowerCase().includes(searchLower)
    );
  }, [options, searchValue]);

  const handleOptionToggle = (key: string) => {
    if (selectionMode === 'single') {
      setTempSelectedKeys([key]);
    } else {
      setTempSelectedKeys(prev =>
        prev.includes(key)
          ? prev.filter(k => k !== key)
          : [...prev, key]
      );
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelectedKeys);
    onClose();
    setSearchValue('');
  };

  const handleCancel = () => {
    setTempSelectedKeys(selectedKeys);
    onClose();
    setSearchValue('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {selectedKeys.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedKeys.map(key => {
                const option = options.find(opt => opt.key === key);
                return option ? (
                  <Chip key={key} size="sm" color="primary" variant="flat">
                    {option.label}
                  </Chip>
                ) : null;
              })}
            </div>
          )}
        </ModalHeader>

        <ModalBody>
          {/* Buscador */}
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            startContent={<IoSearchOutline className="text-default-400" />}
            endContent={
              searchValue ? (
                <button
                  onClick={() => setSearchValue('')}
                  className="text-default-400 hover:text-default-600"
                >
                  <IoCloseOutline size={16} />
                </button>
              ) : null
            }
            className="mb-4"
          />

          {/* Lista de opciones */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="text-center py-8 text-default-400">
                <IoSearchOutline size={48} className="mx-auto mb-2 opacity-50" />
                <p>No se encontraron resultados</p>
                {searchValue && (
                  <p className="text-sm">para "{searchValue}"</p>
                )}
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.key}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    tempSelectedKeys.includes(option.key)
                      ? 'border-primary-500 bg-primary-100 dark:bg-primary-900/30 dark:border-primary-400'
                      : 'border-default-300 dark:border-default-600'
                  }`}
                  onClick={() => handleOptionToggle(option.key)}
                >
                  <div className="flex items-start gap-3">
                    {selectionMode === 'multiple' ? (
                      <div className="flex items-center">
                        <Checkbox
                          isSelected={tempSelectedKeys.includes(option.key)}
                          onChange={() => handleOptionToggle(option.key)}
                          color="primary"
                          size="lg"
                          classNames={{
                            wrapper: "after:bg-primary before:border-default-400 dark:before:border-default-500",
                            icon: "text-white dark:text-white"
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        tempSelectedKeys.includes(option.key)
                          ? 'border-primary-500 bg-primary-500 dark:border-primary-400 dark:bg-primary-400'
                          : 'border-default-400 dark:border-default-500'
                      }`}>
                        {tempSelectedKeys.includes(option.key) && (
                          <IoCheckmarkOutline size={12} className="text-white dark:text-white" />
                        )}
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-medium text-foreground">{option.label}</p>
                      {option.description && (
                        <p className="text-sm text-default-500 mt-1">{option.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Contador de selecciones */}
          {selectionMode === 'multiple' && (
            <div className="text-sm text-default-500 mt-2">
              {tempSelectedKeys.length} elemento{tempSelectedKeys.length !== 1 ? 's' : ''} seleccionado{tempSelectedKeys.length !== 1 ? 's' : ''}
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3 px-6 py-4 border-t border-divider bg-content1">
          <Button
            color="danger"
            variant="light"
            onPress={handleCancel}
            className="font-medium text-danger hover:bg-danger-50"
            size="lg"
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            variant="solid"
            onPress={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold px-8 shadow-lg"
            size="lg"
          >
            GUARDAR
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};