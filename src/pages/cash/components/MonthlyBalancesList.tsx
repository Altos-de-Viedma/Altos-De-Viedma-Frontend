import { useState } from 'react';
import { Icons, UI } from '../../../shared';
import { useMonthlyBalances, useMonthlyTransactions } from '../hooks';
import { getMonthlyTransactions } from '../services';
import { formatCurrency } from '../helpers';
import { exportMonthlyTransactionsToExcel } from '../utils/excelExport';

export const MonthlyBalancesList = () => {
  const { data: monthlyBalances, isLoading } = useMonthlyBalances();
  const [downloadingMonth, setDownloadingMonth] = useState<string | null>(null);

  const getMonthName = (month: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || '';
  };

  const handleDownloadMonth = async (month: number, year: number) => {
    const monthKey = `${year}-${month}`;
    setDownloadingMonth(monthKey);

    try {
      // Use the existing service instead of direct fetch
      const transactions = await getMonthlyTransactions(month, year);

      // Export to Excel
      exportMonthlyTransactionsToExcel(transactions, month, year);

    } catch (error) {
      console.error('Error downloading monthly transactions:', error);
      alert('Error al descargar las transacciones del mes. Por favor, inténtalo de nuevo.');
    } finally {
      setDownloadingMonth(null);
    }
  };

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!monthlyBalances || monthlyBalances.length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.IoCalendarOutline size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No hay datos de balances mensuales</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Icons.IoCalendarOutline size={24} className="text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Balance Mes a Mes
        </h3>
      </div>

      <div className="grid gap-4">
        {monthlyBalances.map((monthData) => (
          <div
            key={`${monthData.year}-${monthData.month}`}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  monthData.balance >= 0
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Icons.IoCalendarOutline
                    size={24}
                    className={
                      monthData.balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {getMonthName(monthData.month)} {monthData.year}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {monthData.transactionCount} transacciones
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    monthData.balance >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {monthData.balance >= 0 ? '+' : ''}{formatCurrency(monthData.balance)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {monthData.balance >= 0 ? (
                      <Icons.IoCheckmarkCircleOutline size={16} className="text-green-500" />
                    ) : (
                      <Icons.IoCloseCircleOutline size={16} className="text-red-500" />
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {monthData.balance >= 0 ? 'Positivo' : 'Negativo'}
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="ml-4">
                  <UI.Button
                    variant="flat"
                    size="sm"
                    onPress={() => handleDownloadMonth(monthData.month, monthData.year)}
                    isLoading={downloadingMonth === `${monthData.year}-${monthData.month}`}
                    startContent={
                      downloadingMonth === `${monthData.year}-${monthData.month}` ?
                        undefined :
                        <Icons.IoDownloadOutline size={16} />
                    }
                    className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 min-w-[100px]"
                  >
                    {downloadingMonth === `${monthData.year}-${monthData.month}` ? 'Descargando...' : 'Excel'}
                  </UI.Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {monthlyBalances.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <Icons.IoInformationCircleOutline size={16} />
            <span>
              Mostrando {monthlyBalances.length} {monthlyBalances.length === 1 ? 'mes' : 'meses'} con actividad.
              Los balances se calculan sumando entradas y restando salidas por mes.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};