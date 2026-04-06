import { useState } from 'react';
import { Icons, UI } from '../../../shared';

interface Props {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export const InvoiceSearch = ({ onSearch, placeholder = "Buscar expensas..." }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md">
      <UI.Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        startContent={
          <Icons.IoSearchOutline
            size={20}
            className="text-gray-400 pointer-events-none flex-shrink-0"
          />
        }
        endContent={
          searchTerm && (
            <UI.Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={clearSearch}
              className="min-w-unit-6 w-6 h-6"
            >
              <Icons.IoCloseOutline size={16} className="text-gray-400" />
            </UI.Button>
          )
        }
        classNames={{
          base: "w-full",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
      />
    </div>
  );
};