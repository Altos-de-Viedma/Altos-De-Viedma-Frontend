import { Icons, UI } from '../../../shared';
import { useInsuranceStatistics } from '../hooks';
import { formatCurrency } from '../helpers';

export const InsuranceStatisticsCards = () => {
  const { data: statistics, isLoading } = useInsuranceStatistics();

  const cards = [
    {
      title: 'Total de Seguros',
      value: statistics?.total || 0,
      icon: <Icons.IoReaderOutline size={24} />,
      color: 'primary' as const,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Seguros Activos',
      value: statistics?.active || 0,
      icon: <Icons.IoCheckmarkCircleOutline size={24} />,
      color: 'success' as const,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Próximos a Vencer',
      value: statistics?.expiringSoon || 0,
      icon: <Icons.IoWarningOutline size={24} />,
      color: 'warning' as const,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Vencidos',
      value: statistics?.expired || 0,
      icon: <Icons.IoCloseCircleOutline size={24} />,
      color: 'danger' as const,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
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
              {isLoading ? (
                <UI.Spinner size="sm" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {card.value}
                </p>
              )}
            </div>
            <div className={`${card.iconColor} p-3 rounded-lg`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};