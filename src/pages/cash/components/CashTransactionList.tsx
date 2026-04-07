import { useState, useMemo } from 'react';

import { CustomTable, Icons, UI } from '../../../shared';
import { CashTransactionForm } from './CashTransactionForm';
import { useDailySummary } from '../hooks';
import { useAuthStore } from '../../auth';
import {
  TransactionType,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_TYPE_LABELS,
  IDailySummary
} from '../interfaces';
import { formatCurrency, formatDateTime, getArgentinaToday } from '../helpers';

// Componente de calendario manual
const CustomCalendar = ({ isOpen, onClose, onDateSelect, selectedDate }: {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  selectedDate: string;
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate && selectedDate !== 'all') {
      const [year, month] = selectedDate.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, 1);
    }
    return new Date();
  });

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Lunes = 0

  const days = [];

  // Días vacíos al inicio
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(null);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const isoDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onDateSelect(isoDate);
    onClose();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Icons.IoChevronBackOutline size={20} />
        </button>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Icons.IoChevronForwardOutline size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => handleDateClick(day)}
                className={`w-full h-full flex items-center justify-center text-sm rounded hover:bg-blue-100 dark:hover:bg-blue-900 ${
                  selectedDate === `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {day}
              </button>
            ) : (
              <div></div>
            )}
          </div>
        ))}
      </div>

      {/* Botón cerrar */}
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export const CashTransactionList = () => {
  const { data: dailySummary, isLoading, refetch } = useDailySummary();
  const { user } = useAuthStore((state) => ({ user: state.user }));

  const [selectedDate, setSelectedDate] = useState<string>(getArgentinaToday()); // Default to today
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isAdmin = user?.roles?.includes('admin');

  // Flatten all transactions from all days
  const allTransactions = useMemo(() => {
    if (!dailySummary || !Array.isArray(dailySummary)) return [];

    return dailySummary.flatMap((day: IDailySummary) =>
      day.transactions?.map(transaction => ({
        ...transaction,
        dayTotal: day.dayTotal || 0,
        cumulativeTotal: day.cumulativeTotal || 0
      })) || []
    );
  }, [dailySummary]);

  // Filter transactions by selected date
  const filteredTransactions = useMemo(() => {
    if (selectedDate === 'all') return allTransactions;

    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate).toISOString().split('T')[0];
      return transactionDate === selectedDate;
    });
  }, [allTransactions, selectedDate]);

  // Calculate totals
  const totals = useMemo(() => {
    const entries = filteredTransactions
      .filter(t => t.type === TransactionType.ENTRY)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const exits = filteredTransactions
      .filter(t => t.type === TransactionType.EXIT)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netTotal = entries - exits;

    return { entries, exits, netTotal };
  }, [filteredTransactions]);


  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  const columns = [
    { name: "Fecha/Hora", uid: "datetime" },
    { name: "Descripción", uid: "description" },
    { name: "Monto", uid: "amount" },
    { name: "Tipo", uid: "type" },
    { name: "Categoría", uid: "category" }
  ];

  const tableData = filteredTransactions.map(transaction => ({
    ...transaction,
    datetime: formatDateTime(transaction.createdAt),
    type: (
      <UI.Chip
        color={transaction.type === TransactionType.ENTRY ? "success" : "danger"}
        startContent={
          transaction.type === TransactionType.ENTRY ?
            <Icons.IoArrowBackOutline size={16} className="rotate-90" /> :
            <Icons.IoArrowForwardOutline size={16} className="rotate-90" />
        }
        variant="flat"
        size="sm"
      >
        {TRANSACTION_TYPE_LABELS[transaction.type]}
      </UI.Chip>
    ),
    category: TRANSACTION_CATEGORY_LABELS[transaction.category],
    description: transaction.description || '-',
    amount: (
      <div className="text-right">
        <span className={`font-mono font-bold text-lg ${
          transaction.type === TransactionType.ENTRY ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === TransactionType.ENTRY ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
        </span>
      </div>
    )
  }));

  const visibleColumns = ["datetime", "description", "amount", "type", "category"];

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filtrar por fecha
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex relative">
                <input
                  type="text"
                  value={selectedDate === 'all' ? '' : (() => {
                    const [year, month, day] = selectedDate.split('-');
                    return `${day}/${month}/${year}`;
                  })()}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Parse dd/mm/yyyy format
                    const dateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                    if (dateMatch) {
                      const [, day, month, year] = dateMatch;
                      const dayNum = parseInt(day, 10);
                      const monthNum = parseInt(month, 10);
                      const yearNum = parseInt(year, 10);

                      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 2020 && yearNum <= 2030) {
                        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        setSelectedDate(isoDate);
                      }
                    } else if (!value) {
                      setSelectedDate('all');
                    }
                  }}
                  placeholder="dd/mm/yyyy"
                  className="flex-1 h-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="h-10 px-3 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Icons.IoCalendarOutline size={18} />
                </button>

                {/* Calendario personalizado */}
                <CustomCalendar
                  isOpen={isCalendarOpen}
                  onClose={() => setIsCalendarOpen(false)}
                  onDateSelect={(date) => setSelectedDate(date)}
                  selectedDate={selectedDate}
                />
              </div>
              {selectedDate !== 'all' && (
                <button
                  onClick={() => setSelectedDate('all')}
                  className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  <Icons.IoCloseOutline size={16} />
                </button>
              )}
            </div>
          </div>

          <UI.Button
            variant="flat"
            size="sm"
            onPress={() => setSelectedDate(getArgentinaToday())}
            startContent={<Icons.IoTimeOutline size={16} />}
            className="bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200"
          >
            Hoy
          </UI.Button>

          <UI.Button
            variant="flat"
            size="sm"
            onPress={() => setSelectedDate('all')}
            startContent={<Icons.IoGridOutline size={16} />}
            className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
          >
            Todas
          </UI.Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Icons.IoCashOutline size={16} />
          <span>
            {selectedDate === 'all' ?
              `${filteredTransactions.length} transacciones` :
              (() => {
                const [year, month, day] = selectedDate.split('-').map(Number);
                const displayDate = new Date(year, month - 1, day);
                return `${filteredTransactions.length} transacciones - ${displayDate.toLocaleDateString('es-AR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}`;
              })()
            }
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <CustomTable
          data={tableData}
          columns={columns}
          initialVisibleColumns={visibleColumns}
          addButtonComponent={isAdmin ? <CashTransactionForm onSuccess={() => refetch()} /> : undefined}
          title="Transacciones de Caja"
          className="w-full shadow-lg border border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Totals Summary */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icons.IoListOutline size={20} />
            Resumen de Montos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Entradas */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <Icons.IoChevronUpOutline size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">Total Entradas</p>
                  <p className="text-xl font-bold text-green-800 dark:text-green-200 font-mono">
                    +{formatCurrency(totals.entries)}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Salidas */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                  <Icons.IoChevronDownOutline size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">Total Salidas</p>
                  <p className="text-xl font-bold text-red-800 dark:text-red-200 font-mono">
                    -{formatCurrency(totals.exits)}
                  </p>
                </div>
              </div>
            </div>

            {/* Balance Neto */}
            <div className={`rounded-lg p-4 border ${
              totals.netTotal >= 0
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  totals.netTotal >= 0
                    ? 'bg-blue-100 dark:bg-blue-900/40'
                    : 'bg-orange-100 dark:bg-orange-900/40'
                }`}>
                  <Icons.IoCashOutline size={20} className={
                    totals.netTotal >= 0
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-orange-600 dark:text-orange-400'
                  } />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    totals.netTotal >= 0
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-orange-700 dark:text-orange-300'
                  }`}>
                    Saldo Neto
                  </p>
                  <p className={`text-xl font-bold font-mono ${
                    totals.netTotal >= 0
                      ? 'text-blue-800 dark:text-blue-200'
                      : 'text-orange-800 dark:text-orange-200'
                  }`}>
                    {totals.netTotal >= 0 ? '+' : ''}{formatCurrency(totals.netTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};