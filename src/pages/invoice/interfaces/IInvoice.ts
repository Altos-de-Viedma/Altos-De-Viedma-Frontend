export interface IInvoice {
  id: string;
  title: string;
  description?: string;
  invoiceUrl: string;
  date: string;
  state: 'in_progress' | 'confirmed';
  status: boolean;
  user: {
    id: string;
    name: string;
    lastName: string;
    phone: string;
  };
  property?: {
    id: string;
    address: string;
    isMain: boolean;
    users?: {
      id: string;
      name: string;
      lastName: string;
      phone: string;
    }[];
  };
  selectedProperties?: {
    id: string;
    address: string;
    isMain: boolean;
  }[];
}