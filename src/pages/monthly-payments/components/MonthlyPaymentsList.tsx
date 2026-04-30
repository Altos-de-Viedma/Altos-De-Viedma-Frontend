import { useState, useMemo } from 'react';
import { CustomTable, Icons, UI } from '../../../shared';
import { MonthlyPaymentForm } from './MonthlyPaymentForm';
import { PropertyStatusBoard } from './PropertyStatusBoard';
import { useMonthlyPaymentsByMonth, useMonthlyPaymentSummary, useUpdateMonthlyPayment } from '../hooks/useMonthlyPayments';
import { useAuthStore } from '../../auth';
import { PaymentStatus } from '../interfaces/IMonthlyPayment';
import {
  formatCurrency,
  getCurrentMonth,
  getMonthYearString,
  MONTH_NAMES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS
} from '../helpers';

export const MonthlyPaymentsList = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const currentDate = getCurrentMonth();
  const [selectedYear, setSelectedYear] = useState(currentDate.year);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('board'); // 'board' or 'table'

  const { data: payments, isLoading, refetch } = useMonthlyPaymentsByMonth(selectedYear, selectedMonth);
  const { data: summary } = useMonthlyPaymentSummary(selectedYear, selectedMonth);
  const updatePaymentMutation = useUpdateMonthlyPayment();

  const isAdmin = user?.roles?.includes('admin');

  // Filter payments by search term
  const filteredPayments = useMemo(() => {
    if (!payments) return [];

    if (!searchTerm.trim()) return payments;

    const searchLower = searchTerm.toLowerCase().trim();
    return payments.filter(payment =>
      payment.property.address.toLowerCase().includes(searchLower) ||
      payment.property.users?.some(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      )
    );
  }, [payments, searchTerm]);

  const handleStatusUpdate = async (paymentId: string, newStatus: PaymentStatus) => {
    await updatePaymentMutation.mutateAsync({
      id: paymentId,
      status: newStatus
    });
  };

  const handleAmountUpdate = async (paymentId: string, newAmount: number) => {
    await updatePaymentMutation.mutateAsync({
      id: paymentId,
      amountPaid: newAmount
    });
  };

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  const columns = [
    { name: "Propiedad", uid: "property" },
    { name: "Propietarios", uid: "owners" },
    { name: "Monto a Pagar", uid: "amountDue" },
    { name: "Monto Pagado", uid: "amountPaid" },
    { name: "Estado", uid: "status" },
    { name: "Fecha de Pago", uid: "paymentDate" },
    { name: "Acciones", uid: "actions" }
  ];

  const tableData = filteredPayments.map(payment => ({
    ...payment,
    property: (
      <div className="flex items-center gap-2">
        {payment.property.isMain && <Icons.IoHomeOutline size={16} className="text-blue-500" />}
        <span className="font-medium">{payment.property.address}</span>
      </div>
    ),
    owners: payment.property.users && payment.property.users.length > 0 ? (
      <div className="flex flex-col gap-1">
        {payment.property.users.map((owner, index) => (
          <span key={owner.id} className="text-sm">
            {owner.lastName}, {owner.name}
            {index < payment.property.users!.length - 1 && <br />}
          </span>
        ))}
      </div>
    ) : (
      <span className="text-gray-400 text-sm">Sin propietarios</span>
    ),
    amountDue: (
      <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
        {formatCurrency(payment.amountDue)}
      </span>
    ),
    amountPaid: (
      <div className="flex items-center gap-2">
        <span className={`font-mono font-semibold ${
          payment.amountPaid > 0 ? 'text-green-600' : 'text-gray-400'
        }`}>
          {formatCurrency(payment.amountPaid)}
        </span>
        {isAdmin && (
          <UI.Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={() => {
              const newAmount = prompt('Nuevo monto pagado:', payment.amountPaid.toString());
              if (newAmount && !isNaN(parseFloat(newAmount))) {
                handleAmountUpdate(payment.id, parseFloat(newAmount));
              }
            }}
          >
            <Icons.IoPencilOutline size={14} />
          </UI.Button>
        )}
      </div>
    ),
    status: (
      <UI.Chip
        color={PAYMENT_STATUS_COLORS[payment.status]}
        variant="flat"
        size="sm"
        startContent={
          payment.status === PaymentStatus.PAID ? <Icons.IoCheckmarkOutline size={14} /> :
          payment.status === PaymentStatus.OVERDUE ? <Icons.IoWarningOutline size={14} /> :
          payment.status === PaymentStatus.PARTIAL ? <Icons.IoTimeOutline size={14} /> :
          <Icons.IoTimeOutline size={14} />
        }
      >
        {PAYMENT_STATUS_LABELS[payment.status]}
      </UI.Chip>
    ),
    paymentDate: payment.paymentDate ? (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {new Date(payment.paymentDate).toLocaleDateString('es-AR')}
      </span>
    ) : (
      <span className="text-gray-400 text-sm">-</span>
    ),
    actions: isAdmin ? (
      <div className="flex gap-2">
        {payment.status !== PaymentStatus.PAID && (
          <UI.Button
            size="sm"
            color="success"
            variant="flat"
            onPress={() => handleStatusUpdate(payment.id, PaymentStatus.PAID)}
            isLoading={updatePaymentMutation.isPending}
          >
            Marcar Pagado
          </UI.Button>
        )}
        <UI.Dropdown>
          <UI.DropdownTrigger>
            <UI.Button
              size="sm"
              variant="light"
              isIconOnly
            >
              <Icons.IoEllipsisVerticalOutline size={16} />
            </UI.Button>
          </UI.DropdownTrigger>
          <UI.DropdownMenu>
            <UI.DropdownItem
              key="pending"
              onPress={() => handleStatusUpdate(payment.id, PaymentStatus.PENDING)}
            >
              Marcar como Pendiente
            </UI.DropdownItem>
            <UI.DropdownItem
              key="partial"
              onPress={() => handleStatusUpdate(payment.id, PaymentStatus.PARTIAL)}
            >
              Marcar como Parcial
            </UI.DropdownItem>
            <UI.DropdownItem
              key="overdue"
              onPress={() => handleStatusUpdate(payment.id, PaymentStatus.OVERDUE)}
            >
              Marcar como Vencido
            </UI.DropdownItem>
          </UI.DropdownMenu>
        </UI.Dropdown>
      </div>
    ) : null
  }));

  const visibleColumns = isAdmin
    ? ["property", "owners", "amountDue", "amountPaid", "status", "paymentDate", "actions"]
    : ["property", "owners", "amountDue", "amountPaid", "status", "paymentDate"];

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with Month/Year Selection */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Icons.IoCalendarOutline size={32} className="text-green-600 dark:text-green-400" />
              Pagos Mensuales
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {getMonthYearString(selectedYear, selectedMonth)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <UI.Select
                label="Año"
                selectedKeys={[selectedYear.toString()]}
                onSelectionChange={(keys) => setSelectedYear(parseInt(Array.from(keys)[0] as string))}
                className="w-24"
                size="sm"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <UI.SelectItem key={year.toString()}>
                      {year}
                    </UI.SelectItem>
                  );
                })}
              </UI.Select>

              <UI.Select
                label="Mes"
                selectedKeys={[selectedMonth.toString()]}
                onSelectionChange={(keys) => setSelectedMonth(parseInt(Array.from(keys)[0] as string))}
                className="w-32"
                size="sm"
              >
                {MONTH_NAMES.map((monthName, index) => (
                  <UI.SelectItem key={(index + 1).toString()}>
                    {monthName}
                  </UI.SelectItem>
                ))}
              </UI.Select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <Icons.IoBusinessOutline size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Propiedades</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {summary.totalProperties}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <Icons.IoCheckmarkCircleOutline size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pagadas</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {summary.paidProperties}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                  <Icons.IoTimeOutline size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {summary.pendingProperties}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                  <Icons.IoStatsChartOutline size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">% Pagado</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {summary.paymentPercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center w-full">
        <UI.Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          aria-label="Payment view tabs"
          size="lg"
          classNames={{
            tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
            cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
            tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
            tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
          }}
        >
          <UI.Tab key="board" title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoGridOutline size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Vista General</span>
              <span className="sm:hidden">General</span>
            </div>
          } />
          <UI.Tab key="table" title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoListOutline size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Vista Detallada</span>
              <span className="sm:hidden">Detalle</span>
            </div>
          } />
        </UI.Tabs>
      </div>

      {/* Tab Content */}
      {activeTab === 'board' ? (
        <PropertyStatusBoard
          payments={payments || []}
          year={selectedYear}
          month={selectedMonth}
          isLoading={isLoading}
        />
      ) : (
        <>
          {/* Search and Actions for Table View */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <UI.Input
                placeholder="Buscar por propiedad o propietario..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={<Icons.IoSearchOutline size={18} />}
                isClearable
                onClear={() => setSearchTerm('')}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Icons.IoReceiptOutline size={16} />
              <span>
                {searchTerm ?
                  `${filteredPayments.length} de ${payments?.length || 0} propiedades` :
                  `${filteredPayments.length} propiedades`
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
              addButtonComponent={isAdmin ? (
                <MonthlyPaymentForm
                  onSuccess={() => refetch()}
                  selectedYear={selectedYear}
                  selectedMonth={selectedMonth}
                />
              ) : undefined}
              title={`Pagos de ${getMonthYearString(selectedYear, selectedMonth)}`}
              className="w-full shadow-lg border border-gray-200 dark:border-gray-700"
              showAllRows={true}
            />
          </div>

          {/* Summary Footer for Table View */}
          {summary && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icons.IoStatsChartOutline size={20} />
                Resumen Financiero
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total a cobrar:</span>
                    <span className="font-mono font-bold text-lg text-gray-900 dark:text-gray-100">
                      {formatCurrency(summary.totalAmountDue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total cobrado:</span>
                    <span className="font-mono font-bold text-lg text-green-600 dark:text-green-400">
                      {formatCurrency(summary.totalAmountPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-900 dark:text-gray-100 font-semibold">Pendiente:</span>
                    <span className="font-mono font-bold text-lg text-red-600 dark:text-red-400">
                      {formatCurrency(summary.totalAmountDue - summary.totalAmountPaid)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Propiedades pagadas:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {summary.paidProperties} de {summary.totalProperties}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Propiedades pendientes:</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {summary.pendingProperties}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Propiedades vencidas:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {summary.overdueProperties}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};