export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  OVERDUE = 'overdue'
}

export interface IPropertyMonthlyPayment {
  id: string;
  property: {
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
  year: number;
  month: number;
  amountDue: number;
  amountPaid: number;
  status: PaymentStatus;
  paymentDate?: string;
  invoice?: {
    id: string;
    title: string;
  };
  paidBy?: {
    id: string;
    name: string;
    lastName: string;
  };
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMonthlyPaymentSummary {
  year: number;
  month: number;
  totalProperties: number;
  paidProperties: number;
  pendingProperties: number;
  overdueProperties: number;
  totalAmountDue: number;
  totalAmountPaid: number;
  paymentPercentage: number;
}

export interface IPropertyPaymentStatus {
  property: {
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
  payments: IPropertyMonthlyPayment[];
  currentMonthStatus: PaymentStatus;
  totalOwed: number;
  totalPaid: number;
}