import { useMemo } from 'react';
import { Icons, UI } from '../../../shared';
import { IPropertyMonthlyPayment, PaymentStatus } from '../interfaces/IMonthlyPayment';
import { formatDate, getMonthYearString } from '../helpers';

interface PropertyStatusBoardProps {
  payments: IPropertyMonthlyPayment[];
  year: number;
  month: number;
  isLoading: boolean;
}

export const PropertyStatusBoard = ({
  payments,
  year,
  month,
  isLoading
}: PropertyStatusBoardProps) => {

  // Sort properties alphabetically by address and prepare data
  const sortedProperties = useMemo(() => {
    if (!payments) return [];

    return [...payments]
      .sort((a, b) => a.property.address.localeCompare(b.property.address))
      .map(payment => ({
        ...payment,
        isPaid: payment.status === PaymentStatus.PAID,
        isPartial: payment.status === PaymentStatus.PARTIAL,
        isOverdue: payment.status === PaymentStatus.OVERDUE,
        ownerNames: payment.property.users?.map(user => `${user.name} ${user.lastName}`).join(', ') || 'Sin propietarios'
      }));
  }, [payments]);

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  const paidCount = sortedProperties.filter(p => p.isPaid).length;
  const totalCount = sortedProperties.length;

  return (
    <div className="space-y-6">
      {/* Header with Month and Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {getMonthYearString(year, month)}
          </h2>
          <div className="flex items-center justify-center gap-4 text-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-700 dark:text-green-300">
                {paidCount} Pagadas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-red-700 dark:text-red-300">
                {totalCount - paidCount} Pendientes
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Total: {totalCount} propiedades
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid - All visible, no pagination */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Icons.IoListOutline size={24} />
            Estado de Pagos por Propiedad
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Ordenado alfabéticamente • Sin paginación
          </div>
        </div>

        <div className="space-y-3">
          {sortedProperties.map((payment) => (
            <div
              key={payment.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                payment.isPaid
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : payment.isPartial
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  : payment.isOverdue
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                  : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
              }`}
            >
              {/* Left side: Status indicator + Property info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Status Dot */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      payment.isPaid
                        ? 'bg-green-500'
                        : payment.isPartial
                        ? 'bg-blue-500'
                        : payment.isOverdue
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {payment.isPaid ? (
                      <Icons.IoCheckmarkOutline size={16} className="text-white" />
                    ) : payment.isPartial ? (
                      <Icons.IoTimeOutline size={16} className="text-white" />
                    ) : payment.isOverdue ? (
                      <Icons.IoWarningOutline size={16} className="text-white" />
                    ) : (
                      <Icons.IoTimeOutline size={16} className="text-white" />
                    )}
                  </div>
                </div>

                {/* Property Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {payment.property.isMain && (
                      <Icons.IoHomeOutline size={18} className="text-blue-500 flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {payment.property.address}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {payment.ownerNames}
                  </p>
                </div>
              </div>

              {/* Right side: Payment info */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Amount */}
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Monto</div>
                  <div className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    ${payment.amountDue.toLocaleString()}
                  </div>
                </div>

                {/* Payment Date */}
                <div className="text-right min-w-[120px]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Fecha de Pago</div>
                  <div className={`font-semibold ${
                    payment.paymentDate
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {payment.paymentDate ? formatDate(payment.paymentDate) : 'No pagado'}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="min-w-[100px]">
                  <UI.Chip
                    size="sm"
                    variant="flat"
                    color={
                      payment.isPaid ? 'success' :
                      payment.isPartial ? 'primary' :
                      payment.isOverdue ? 'danger' : 'warning'
                    }
                    className="w-full justify-center"
                  >
                    {payment.isPaid ? 'Pagado' :
                     payment.isPartial ? 'Parcial' :
                     payment.isOverdue ? 'Vencido' : 'Pendiente'}
                  </UI.Chip>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {sortedProperties.length === 0 && (
          <div className="text-center py-12">
            <Icons.IoDocumentTextOutline size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No hay registros de pago
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron registros de pago para {getMonthYearString(year, month)}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">Pagadas</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                {paidCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Parciales</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {sortedProperties.filter(p => p.isPartial).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {sortedProperties.filter(p => p.status === PaymentStatus.PENDING).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">Vencidas</p>
              <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                {sortedProperties.filter(p => p.isOverdue).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};