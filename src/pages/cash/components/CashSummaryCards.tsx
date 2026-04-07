import { useMemo } from 'react';
import { Icons, UI } from '../../../shared';
import { useCurrentDayTotal, useTotalBalance, useMonthlyBalance, useDailySummary } from '../hooks';
import { formatCurrency, formatDate } from '../helpers';

export const CashSummaryCards = () => {
  const { data: currentDay, isLoading: loadingCurrentDay } = useCurrentDayTotal();
  const { data: totalBalance, isLoading: loadingBalance } = useTotalBalance();
  const { data: monthlyBalance, isLoading: loadingMonthlyBalance } = useMonthlyBalance();
  const { data: dailySummary, isLoading: loadingSummary } = useDailySummary();

  const summaryStats = useMemo(() => {
    if (!dailySummary || !Array.isArray(dailySummary) || dailySummary.length === 0) {
      return {
        totalDays: 0,
        totalEntries: 0,
        totalExits: 0,
        averageDailyMovement: 0
      };
    }

    const totalEntries = dailySummary.reduce((sum, day) => sum + (day.entries || 0), 0);
    const totalExits = dailySummary.reduce((sum, day) => sum + (day.exits || 0), 0);
    const totalDays = dailySummary.length;
    const averageDailyMovement = totalDays > 0 ? (totalEntries + totalExits) / totalDays : 0;

    return {
      totalDays,
      totalEntries,
      totalExits,
      averageDailyMovement
    };
  }, [dailySummary]);

  const cards = [
    {
      title: 'Saldo Total',
      value: totalBalance || 0,
      loading: loadingBalance,
      icon: <Icons.IoCashOutline size={24} />,
      color: 'primary' as const,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      formatter: formatCurrency
    },
    {
      title: `Saldo de este mes ${monthlyBalance ? `(${monthlyBalance.month}/${monthlyBalance.year})` : ''}`,
      value: monthlyBalance?.balance || 0,
      loading: loadingMonthlyBalance,
      icon: <Icons.IoCalendarOutline size={24} />,
      color: (monthlyBalance?.balance || 0) >= 0 ? 'success' as const : 'danger' as const,
      bgColor: (monthlyBalance?.balance || 0) >= 0 ?
        'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20',
      iconColor: (monthlyBalance?.balance || 0) >= 0 ?
        'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
      formatter: formatCurrency
    },
    {
      title: `Entradas ${currentDay ? formatDate(currentDay.date) : 'Hoy'}`,
      value: currentDay?.entries || 0,
      loading: loadingCurrentDay,
      icon: <Icons.IoArrowBackOutline size={24} className="rotate-90" />,
      color: 'success' as const,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      formatter: formatCurrency
    },
    {
      title: `Salidas ${currentDay ? formatDate(currentDay.date) : 'Hoy'}`,
      value: currentDay?.exits || 0,
      loading: loadingCurrentDay,
      icon: <Icons.IoArrowForwardOutline size={24} className="rotate-90" />,
      color: 'danger' as const,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      formatter: formatCurrency
    },
    {
      title: `Saldo del día ${currentDay ? formatDate(currentDay.date) : 'Hoy'}`,
      value: (currentDay?.entries || 0) - (currentDay?.exits || 0),
      loading: loadingCurrentDay,
      icon: <Icons.IoTimeOutline size={24} />,
      color: ((currentDay?.entries || 0) - (currentDay?.exits || 0)) >= 0 ? 'success' as const : 'danger' as const,
      bgColor: ((currentDay?.entries || 0) - (currentDay?.exits || 0)) >= 0 ?
        'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      iconColor: ((currentDay?.entries || 0) - (currentDay?.exits || 0)) >= 0 ?
        'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      formatter: formatCurrency
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                {card.loading ? (
                  <UI.Spinner size="sm" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {card.formatter(card.value)}
                  </p>
                )}
              </div>
              <div className={`${card.iconColor} ${card.bgColor} p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icons.IoCalendarOutline size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Días con Movimientos</p>
              {loadingSummary ? (
                <UI.Spinner size="sm" />
              ) : (
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {summaryStats.totalDays}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Icons.IoGridOutline size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Promedio Diario</p>
              {loadingSummary ? (
                <UI.Spinner size="sm" />
              ) : (
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(summaryStats.averageDailyMovement)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
              <Icons.IoDocumentTextOutline size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transacciones Hoy</p>
              {loadingCurrentDay ? (
                <UI.Spinner size="sm" />
              ) : (
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {currentDay?.transactionCount || 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Day Info */}
      {currentDay && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Resumen del Día - {formatDate(currentDay.date)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Entradas: </span>
                  <span className="font-semibold text-green-600">{formatCurrency(currentDay.entries)}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Salidas: </span>
                  <span className="font-semibold text-red-600">{formatCurrency(currentDay.exits)}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Balance: </span>
                  <span className={`font-semibold ${
                    currentDay.dayTotal >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(currentDay.dayTotal)}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block">
              <Icons.IoTimeOutline size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};