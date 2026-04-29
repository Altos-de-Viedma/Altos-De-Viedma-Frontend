import { useState, useEffect } from 'react';
import { UI, Icons } from '../../../shared';
import { altosDeViedmaApi } from '../../../api';

interface Property {
  id: string;
  address: string;
  description: string;
  isMain: boolean;
}

interface PropertySelectorProps {
  ownerName: string;
  selectedPropertyIds: string[];
  onSelectionChange: (propertyIds: string[]) => void;
  isLoading?: boolean;
}

export const PropertySelector = ({
  ownerName,
  selectedPropertyIds,
  onSelectionChange,
  isLoading = false
}: PropertySelectorProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  useEffect(() => {
    const fetchOwnerProperties = async () => {
      if (!ownerName) return;

      setLoadingProperties(true);
      try {
        const { data } = await altosDeViedmaApi.get(`/property/by-owner-name?name=${encodeURIComponent(ownerName)}`);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching owner properties:', error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchOwnerProperties();
  }, [ownerName]);

  const handlePropertyToggle = (propertyId: string) => {
    const newSelection = selectedPropertyIds.includes(propertyId)
      ? selectedPropertyIds.filter(id => id !== propertyId)
      : [...selectedPropertyIds, propertyId];

    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allPropertyIds = properties.map(p => p.id);
    onSelectionChange(allPropertyIds);
  };

  const handleSelectNone = () => {
    onSelectionChange([]);
  };

  if (loadingProperties) {
    return (
      <div className="flex justify-center py-4">
        <UI.Spinner size="sm" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No se encontraron propiedades para este propietario
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Seleccionar propiedades ({selectedPropertyIds.length} de {properties.length})
        </h4>
        <div className="flex gap-2">
          <UI.Button
            size="sm"
            variant="light"
            onPress={handleSelectAll}
            isDisabled={isLoading || selectedPropertyIds.length === properties.length}
          >
            Todas
          </UI.Button>
          <UI.Button
            size="sm"
            variant="light"
            onPress={handleSelectNone}
            isDisabled={isLoading || selectedPropertyIds.length === 0}
          >
            Ninguna
          </UI.Button>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {properties.map((property) => (
          <div
            key={property.id}
            className={`
              flex items-center p-3 rounded-lg border cursor-pointer transition-colors
              ${selectedPropertyIds.includes(property.id)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }
            `}
            onClick={() => handlePropertyToggle(property.id)}
          >
            <UI.Checkbox
              isSelected={selectedPropertyIds.includes(property.id)}
              onValueChange={() => handlePropertyToggle(property.id)}
              isDisabled={isLoading}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {property.isMain && (
                  <Icons.IoHomeOutline className="text-blue-500" size={16} />
                )}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {property.address}
                </span>
              </div>
              {property.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {property.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPropertyIds.length === 0 && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Icons.IoWarningOutline size={16} />
            <span>Selecciona al menos una propiedad para continuar</span>
          </div>
        </div>
      )}
    </div>
  );
};