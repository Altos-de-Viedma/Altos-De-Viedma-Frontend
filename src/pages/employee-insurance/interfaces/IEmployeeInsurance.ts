
export enum InsuranceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  EXPIRED = 'expired'
}

export interface IEmployeeInsurance {
  id: string;
  employeeName: string;
  employeePosition: string;
  employeeDocument: string;
  employeePhone?: string;
  insuranceCompany: string;
  policyNumber: string;
  coverageAmount: number;
  monthlyPremium: number;
  startDate: Date;
  expirationDate: Date;
  status: InsuranceStatus;
  proofUrl?: string;
  notes?: string;
  propertyId?: string;
  isActive: boolean;
  createdBy: {
    id: string;
    name: string;
    lastName: string;
  };
  updatedBy?: {
    id: string;
    name: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isExpired: boolean;
}

export interface ICreateEmployeeInsurance {
  employeeName: string;
  employeePosition: string;
  employeeDocument: string;
  employeePhone?: string;
  insuranceCompany: string;
  policyNumber: string;
  coverageAmount: number;
  monthlyPremium: number;
  startDate: string;
  expirationDate: string;
  status?: InsuranceStatus;
  proofUrl?: string;
  notes?: string;
  propertyId?: string;
}

export interface IInsuranceStatistics {
  total: number;
  active: number;
  expired: number;
  expiringSoon: number;
  inactive: number;
}


export const INSURANCE_STATUS_LABELS: Record<InsuranceStatus, string> = {
  [InsuranceStatus.ACTIVE]: 'Activo',
  [InsuranceStatus.INACTIVE]: 'Inactivo',
  [InsuranceStatus.PENDING]: 'Pendiente',
  [InsuranceStatus.EXPIRED]: 'Vencido'
};