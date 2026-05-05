import { useQuery } from '@tanstack/react-query';
import { IOwnerContact } from '../interfaces';
import { useAllProperties } from '../../property/hooks';
import { IProperty } from '../../property/interfaces';
import { IUser } from '../../users/interfaces';

/**
 * Hook to get all owners/contacts from properties
 */
export const useOwners = () => {
  const { properties, isLoading: propertiesLoading } = useAllProperties();

  return useQuery({
    queryKey: ['owners'],
    queryFn: (): IOwnerContact[] => {
      if (!properties) return [];

      const owners: IOwnerContact[] = [];

      properties.forEach((property: IProperty) => {
        property.users.forEach((user: IUser) => {
          // Only include users with phone numbers
          if (user.phone && user.phone.trim()) {
            owners.push({
              id: user.id,
              name: user.name,
              lastName: user.lastName,
              phone: user.phone,
              address: user.address,
              propertyId: property.id,
              propertyAddress: property.address,
              isSelected: false
            });
          }
        });
      });

      // Remove duplicates based on user ID
      const uniqueOwners = owners.filter((owner, index, self) =>
        index === self.findIndex(o => o.id === owner.id)
      );

      return uniqueOwners;
    },
    enabled: !!properties && !propertiesLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};