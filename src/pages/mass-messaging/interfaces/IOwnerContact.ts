export interface IOwnerContact {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  address: string;
  propertyId?: string;
  propertyAddress?: string;
  isSelected?: boolean;
}