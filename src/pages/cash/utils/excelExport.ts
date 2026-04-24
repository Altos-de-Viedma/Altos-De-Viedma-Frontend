import * as XLSX from 'xlsx';
import { formatCurrency, formatDateTime } from '../helpers';
import { TRANSACTION_TYPE_LABELS, TRANSACTION_CATEGORY_LABELS, TransactionType } from '../interfaces';

export interface TransactionForExport {
  id: string;
  transactionDate: string;
  createdAt: string;
  description: string;
  amount: number;
  type: string;
  category: string;
}

export const exportMonthlyTransactionsToExcel = (
  transactions: TransactionForExport[],
  month: number,
  year: number
) => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Prepare data for Excel
  const excelData = transactions.map((transaction, index) => ({
    '#': index + 1,
    'Fecha de Transacción': new Date(transaction.transactionDate).toLocaleDateString('es-AR'),
    'Fecha/Hora de Creación': formatDateTime(transaction.createdAt),
    'Descripción': transaction.description || '-',
    'Monto': Number(transaction.amount),
    'Tipo': TRANSACTION_TYPE_LABELS[transaction.type as keyof typeof TRANSACTION_TYPE_LABELS] || transaction.type,
    'Categoría': TRANSACTION_CATEGORY_LABELS[transaction.category as keyof typeof TRANSACTION_CATEGORY_LABELS] || transaction.category,
    'Monto Formateado': formatCurrency(Number(transaction.amount))
  }));

  // Calculate totals
  const totalEntries = transactions
    .filter(t => t.type === TransactionType.ENTRY)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExits = transactions
    .filter(t => t.type === TransactionType.EXIT)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netTotal = totalEntries - totalExits;

  // Add summary rows
  excelData.push(
    {},
    { '#': '', 'Fecha de Transacción': 'RESUMEN DEL MES', 'Fecha/Hora de Creación': '', 'Descripción': '', 'Monto': '', 'Tipo': '', 'Categoría': '', 'Monto Formateado': '' },
    { '#': '', 'Fecha de Transacción': 'Total Entradas:', 'Fecha/Hora de Creación': '', 'Descripción': '', 'Monto': totalEntries, 'Tipo': '', 'Categoría': '', 'Monto Formateado': formatCurrency(totalEntries) },
    { '#': '', 'Fecha de Transacción': 'Total Salidas:', 'Fecha/Hora de Creación': '', 'Descripción': '', 'Monto': totalExits, 'Tipo': '', 'Categoría': '', 'Monto Formateado': formatCurrency(totalExits) },
    { '#': '', 'Fecha de Transacción': 'Balance Neto:', 'Fecha/Hora de Creación': '', 'Descripción': '', 'Monto': netTotal, 'Tipo': '', 'Categoría': '', 'Monto Formateado': formatCurrency(netTotal) }
  );

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 5 },   // #
    { wch: 18 },  // Fecha de Transacción
    { wch: 20 },  // Fecha/Hora de Creación
    { wch: 30 },  // Descripción
    { wch: 12 },  // Monto
    { wch: 12 },  // Tipo
    { wch: 15 },  // Categoría
    { wch: 15 }   // Monto Formateado
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  const sheetName = `${monthNames[month - 1]} ${year}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate filename
  const filename = `Transacciones_Caja_${monthNames[month - 1]}_${year}.xlsx`;

  // Save file
  XLSX.writeFile(wb, filename);
};