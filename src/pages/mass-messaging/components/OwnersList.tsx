import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Checkbox,
  Button,
  Chip,
  Avatar,
  Divider,
  Spinner
} from '@heroui/react';
import { Icons } from '../../../shared';
import { IOwnerContact } from '../interfaces';

interface OwnersListProps {
  owners: IOwnerContact[];
  selectedOwners: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  isLoading?: boolean;
}

export const OwnersList: React.FC<OwnersListProps> = ({
  owners,
  selectedOwners,
  onSelectionChange,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOwners = useMemo(() => {
    if (!searchTerm.trim()) return owners;

    const term = searchTerm.toLowerCase();
    return owners.filter(owner =>
      owner.name.toLowerCase().includes(term) ||
      owner.lastName.toLowerCase().includes(term) ||
      owner.phone.includes(term) ||
      owner.address.toLowerCase().includes(term) ||
      owner.propertyAddress?.toLowerCase().includes(term)
    );
  }, [owners, searchTerm]);

  const handleSelectAll = () => {
    if (selectedOwners.length === filteredOwners.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredOwners.map(owner => owner.id));
    }
  };

  const handleOwnerToggle = (ownerId: string) => {
    if (selectedOwners.includes(ownerId)) {
      onSelectionChange(selectedOwners.filter(id => id !== ownerId));
    } else {
      onSelectionChange([...selectedOwners, ownerId]);
    }
  };

  const isAllSelected = filteredOwners.length > 0 && selectedOwners.length === filteredOwners.length;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody className="flex items-center justify-center py-8">
          <Spinner size="lg" />
          <p className="mt-4 text-foreground/60">Cargando propietarios...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.IoPeopleOutline className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Propietarios</h3>
              <Chip size="sm" variant="flat" color="primary">
                {filteredOwners.length}
              </Chip>
            </div>
            {filteredOwners.length > 0 && (
              <Button
                size="sm"
                variant="flat"
                color={isAllSelected ? "danger" : "primary"}
                startContent={isAllSelected ? <Icons.IoCloseOutline className="w-4 h-4" /> : <Icons.IoCheckmarkOutline className="w-4 h-4" />}
                onPress={handleSelectAll}
              >
                {isAllSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </Button>
            )}
          </div>

          <Input
            placeholder="Buscar por nombre, teléfono o dirección..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Icons.IoSearchOutline className="w-4 h-4 text-foreground/40" />}
            isClearable
            onClear={() => setSearchTerm('')}
            className="w-full"
          />

          {selectedOwners.length > 0 && (
            <div className="flex items-center gap-2">
              <Chip color="success" variant="flat">
                {selectedOwners.length} seleccionados
              </Chip>
            </div>
          )}
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="p-0">
        {filteredOwners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icons.IoPeopleOutline className="w-12 h-12 text-foreground/20 mb-4" />
            <p className="text-foreground/60">
              {searchTerm ? 'No se encontraron propietarios con ese criterio' : 'No hay propietarios disponibles'}
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {filteredOwners.map((owner, index) => (
              <div key={owner.id}>
                <div className="flex items-center gap-4 p-4 hover:bg-content2/50 transition-colors">
                  <Checkbox
                    isSelected={selectedOwners.includes(owner.id)}
                    onValueChange={() => handleOwnerToggle(owner.id)}
                    color="primary"
                  />

                  <Avatar
                    name={`${owner.name} ${owner.lastName}`}
                    className="flex-shrink-0"
                    size="sm"
                    color="primary"
                    showFallback
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground truncate">
                        {owner.name} {owner.lastName}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Icons.IoCallOutline className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{owner.phone}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Icons.IoLocationOutline className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{owner.address}</span>
                      </div>

                      {owner.propertyAddress && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-content2 px-2 py-1 rounded-full truncate">
                            Propiedad: {owner.propertyAddress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {index < filteredOwners.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};