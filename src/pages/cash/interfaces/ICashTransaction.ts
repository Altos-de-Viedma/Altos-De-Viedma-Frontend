export enum TransactionType {
  ENTRY = 'entry',
  EXIT = 'exit'
}

export enum TransactionCategory {
  CONSTRUCTION_MATERIALS = 'construction_materials',
  SALARY_PAYMENTS = 'salary_payments',
  ELECTRICITY_SERVICE = 'electricity_service',
  WATER_SERVICE = 'water_service',
  GAS_SERVICE = 'gas_service',
  INTERNET_SERVICE = 'internet_service',
  SECURITY_SERVICE = 'security_service',
  CLEANING_SERVICE = 'cleaning_service',
  MAINTENANCE = 'maintenance',
  OFFICE_SUPPLIES = 'office_supplies',
  FUEL = 'fuel',
  INSURANCE = 'insurance',
  TAXES = 'taxes',
  BANK_FEES = 'bank_fees',
  OTHER_INCOME = 'other_income',
  OTHER_EXPENSE = 'other_expense'
}

export interface ICashTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
  transactionDate: Date;
  isActive: boolean;
  createdBy: {
    id: string;
    name: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCashTransaction {
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description?: string;
}

export interface IDailySummary {
  date: Date;
  transactions: ICashTransaction[];
  entries: number;
  exits: number;
  dayTotal: number;
  cumulativeTotal: number;
}

export interface ICurrentDayTotal {
  date: Date;
  entries: number;
  exits: number;
  dayTotal: number;
  transactionCount: number;
}

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  [TransactionCategory.CONSTRUCTION_MATERIALS]: 'Materiales de Obra',
  [TransactionCategory.SALARY_PAYMENTS]: 'Pago de Salarios',
  [TransactionCategory.ELECTRICITY_SERVICE]: 'Servicio de Luz',
  [TransactionCategory.WATER_SERVICE]: 'Servicio de Agua',
  [TransactionCategory.GAS_SERVICE]: 'Servicio de Gas',
  [TransactionCategory.INTERNET_SERVICE]: 'Servicio de Internet',
  [TransactionCategory.SECURITY_SERVICE]: 'Servicio de Seguridad',
  [TransactionCategory.CLEANING_SERVICE]: 'Servicio de Limpieza',
  [TransactionCategory.MAINTENANCE]: 'Mantenimiento',
  [TransactionCategory.OFFICE_SUPPLIES]: 'Útiles de Oficina',
  [TransactionCategory.FUEL]: 'Combustible',
  [TransactionCategory.INSURANCE]: 'Seguros',
  [TransactionCategory.TAXES]: 'Impuestos',
  [TransactionCategory.BANK_FEES]: 'Comisiones Bancarias',
  [TransactionCategory.OTHER_INCOME]: 'Otros Ingresos',
  [TransactionCategory.OTHER_EXPENSE]: 'Otros Gastos'
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.ENTRY]: 'Entrada',
  [TransactionType.EXIT]: 'Salida'
};