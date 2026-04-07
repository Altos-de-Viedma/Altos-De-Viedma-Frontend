import { useState, useMemo } from 'react';
import { Icons, UI, CustomTable } from '../../../shared';
import { useAllInvoices } from '../hooks';
import { useAllProperties } from '../../property/hooks';
import { IInvoice } from '../interfaces/IInvoice';

interface MonthlyData {
  year: number;
  month: number;
  monthName: string;
  properties: PropertyStatus[];
  totalProperties: number;
  submittedCount: number;
  approvedCount: number;
  pendingCount: number;
}

interface PropertyStatus {
  propertyId: string;
  address: string;
  isMain: boolean;
  hasSubmitted: boolean;
  status: 'pending' | 'approved' | 'not_submitted';
  invoice?: IInvoice;
  owners: string[];
}

export const MonthlyPropertyStatus = () => {
  const { invoices, isLoading: invoicesLoading } = useAllInvoices(); // Always get ALL invoices for monthly status
  const { properties, isLoading: propertiesLoading } = useAllProperties(); // Always get ALL properties for monthly status
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isLoading = invoicesLoading || propertiesLoading;

  const monthlyData = useMemo(() => {
    if (!invoices || !properties) return [];

    // Group invoices by month/year
    const monthGroups = new Map<string, IInvoice[]>();
    invoices.forEach(invoice => {
      const date = new Date(invoice.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthGroups.has(monthKey)) {
        monthGroups.set(monthKey, []);
      }
      monthGroups.get(monthKey)!.push(invoice);
    });

    // Create monthly data
    const monthlyDataArray: MonthlyData[] = [];

    monthGroups.forEach((monthInvoices, monthKey) => {
      const [year, month] = monthKey.split('-').map(Number);
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      // Create property status for this month using ALL properties
      const propertyStatusMap = new Map<string, PropertyStatus>();

      // Initialize all properties as not submitted
      properties.forEach(property => {
        propertyStatusMap.set(property.id, {
          propertyId: property.id,
          address: property.address,
          isMain: property.isMain,
          hasSubmitted: false,
          status: 'not_submitted',
          owners: property.users?.map(u => `${u.name} ${u.lastName}`) || []
        });
      });

      // Update properties that submitted invoices this month
      monthInvoices.forEach((invoice: IInvoice) => {
        if (invoice.property && propertyStatusMap.has(invoice.property.id)) {
          const existingProperty = propertyStatusMap.get(invoice.property.id)!;
          propertyStatusMap.set(invoice.property.id, {
            ...existingProperty,
            hasSubmitted: true,
            status: invoice.state === 'confirmed' ? 'approved' : 'pending',
            invoice: invoice
          });
        }
      });

      // Convert to array and sort alphabetically
      const propertiesArray = Array.from(propertyStatusMap.values()).sort((a, b) => {
        if (a.isMain && !b.isMain) return -1;
        if (!a.isMain && b.isMain) return 1;
        return a.address.localeCompare(b.address);
      });

      const submittedCount = propertiesArray.filter(p => p.hasSubmitted).length;
      const approvedCount = propertiesArray.filter(p => p.status === 'approved').length;
      const pendingCount = propertiesArray.filter(p => p.status === 'pending' || p.status === 'not_submitted').length;

      monthlyDataArray.push({
        year,
        month,
        monthName: monthNames[month],
        properties: propertiesArray,
        totalProperties: propertiesArray.length,
        submittedCount,
        approvedCount,
        pendingCount
      });
    });

    // Sort by most recent first
    return monthlyDataArray.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [invoices, properties]);

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (monthlyData.length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.IoCalendarOutline size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No hay datos de expensas por mes</p>
      </div>
    );
  }

  const selectedMonthData = selectedMonth ?
    monthlyData.find(m => `${m.year}-${m.month}` === selectedMonth) :
    monthlyData[0];

  // Prepare table data with filtering
  const getFilteredProperties = (properties: PropertyStatus[], filter: string) => {
    switch (filter) {
      case 'approved':
        return properties.filter(p => p.status === 'approved');
      case 'pending':
        return properties.filter(p => p.status === 'pending' || p.status === 'not_submitted');
      case 'all':
      default:
        return properties;
    }
  };

  const tableData = selectedMonthData ? getFilteredProperties(selectedMonthData.properties, statusFilter)
    .sort((a, b) => {
      // Sort by completion: approved first, then all pending (both pending and not_submitted)
      const aCompleted = a.status === 'approved';
      const bCompleted = b.status === 'approved';

      if (aCompleted && !bCompleted) return -1;
      if (!aCompleted && bCompleted) return 1;

      // Within same completion status, sort by specific status (pending before not_submitted)
      if (!aCompleted && !bCompleted) {
        if (a.status === 'pending' && b.status === 'not_submitted') return -1;
        if (a.status === 'not_submitted' && b.status === 'pending') return 1;
      }

      // Within same status, sort alphabetically by address
      if (a.isMain && !b.isMain) return -1;
      if (!a.isMain && b.isMain) return 1;
      return a.address.localeCompare(b.address);
    })
    .map(property => ({
    ...property,
    address: property.isMain ? `🏠 ${property.address}` : property.address,
    owners: property.owners.join(', ') || 'Sin propietarios',
    uploadDate: property.invoice ?
      new Date(property.invoice.date).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) :
      <span className="text-gray-400">-</span>,
    status: property.status === 'approved' ? (
      <UI.Chip color="success" variant="flat" startContent={<Icons.IoCheckmarkOutline size={16} />}>
        Aprobada
      </UI.Chip>
    ) : property.status === 'pending' ? (
      <UI.Chip color="warning" variant="flat" startContent={<Icons.IoTimeOutline size={16} />}>
        Pago Pendiente
      </UI.Chip>
    ) : (
      <UI.Chip color="danger" variant="flat" startContent={<Icons.IoCloseOutline size={16} />}>
        No Subió
      </UI.Chip>
    ),
    actions: property.invoice ? (
      <UI.Button
        as="a"
        href={property.invoice.invoiceUrl}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        variant="light"
        size="sm"
        startContent={<Icons.IoLinkOutline size={16} />}
      >
        Ver
      </UI.Button>
    ) : (
      <span className="text-gray-400">-</span>
    )
  })) : [];

  const columns = [
    { name: "Propiedad", uid: "address" },
    { name: "Propietarios", uid: "owners" },
    { name: "Fecha Subida", uid: "uploadDate" },
    { name: "Estado", uid: "status" },
    { name: "Expensa", uid: "actions" }
  ];

  const visibleColumns = ["address", "owners", "uploadDate", "status", "actions"];

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Seleccionar mes
          </label>
          <UI.Select
            placeholder="Selecciona un mes"
            selectedKeys={selectedMonth ? [selectedMonth] : []}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string;
              setSelectedMonth(key || '');
            }}
            classNames={{
              trigger: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
            }}
          >
            {monthlyData.map((monthData) => (
              <UI.SelectItem
                key={`${monthData.year}-${monthData.month}`}
              >
                {monthData.monthName} {monthData.year}
              </UI.SelectItem>
            ))}
          </UI.Select>
        </div>

        {selectedMonthData && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Icons.IoHomeOutline size={16} />
            <span>
              {selectedMonthData.submittedCount} de {selectedMonthData.totalProperties} propiedades
            </span>
          </div>
        )}
      </div>

      {selectedMonthData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Icons.IoHomeOutline size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedMonthData.totalProperties}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Icons.IoCheckmarkCircleOutline size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {selectedMonthData.submittedCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Subieron</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <Icons.IoShieldCheckmarkOutline size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedMonthData.approvedCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Aprobadas</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Icons.IoTimeOutline size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {selectedMonthData.pendingCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pagos Pendientes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Table with Status Filter */}
          <div className="w-full space-y-4">
            {/* Status Filter Tabs */}
            <div className="flex justify-center w-full">
              <UI.Tabs
                selectedKey={statusFilter}
                onSelectionChange={(key) => setStatusFilter(key as string)}
                aria-label="Property status filter"
                size="md"
                classNames={{
                  tabList: "gap-2 border border-gray-200 dark:border-gray-700 p-1 rounded-lg w-auto",
                  cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md",
                  tab: "px-4 py-2 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white text-sm",
                  tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
                }}
              >
                <UI.Tab
                  key="all"
                  title={
                    <div className="flex items-center gap-2">
                      <Icons.IoGridOutline size={16} />
                      <span>Todas</span>
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {selectedMonthData?.totalProperties || 0}
                      </span>
                    </div>
                  }
                />
                <UI.Tab
                  key="approved"
                  title={
                    <div className="flex items-center gap-2">
                      <Icons.IoCheckmarkCircleOutline size={16} />
                      <span>Aprobadas</span>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {selectedMonthData?.approvedCount || 0}
                      </span>
                    </div>
                  }
                />
                <UI.Tab
                  key="pending"
                  title={
                    <div className="flex items-center gap-2">
                      <Icons.IoTimeOutline size={16} />
                      <span>Pagos Pendientes</span>
                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {selectedMonthData ? (selectedMonthData.totalProperties - selectedMonthData.approvedCount) : 0}
                      </span>
                    </div>
                  }
                />
              </UI.Tabs>
            </div>

            <CustomTable
              data={tableData}
              columns={columns}
              initialVisibleColumns={visibleColumns}
              title={`${
                statusFilter === 'approved' ? 'Propiedades Aprobadas' :
                statusFilter === 'pending' ? 'Propiedades con Pagos Pendientes' :
                'Todas las Propiedades'
              } - ${selectedMonthData.monthName} ${selectedMonthData.year}`}
              className="w-full"
            />
          </div>

          {/* Progress Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Progreso del Mes
              </h4>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMonthData.totalProperties > 0 ?
                  Math.round((selectedMonthData.submittedCount / selectedMonthData.totalProperties) * 100) : 0
                }% completado
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${selectedMonthData.totalProperties > 0 ? (selectedMonthData.submittedCount / selectedMonthData.totalProperties) * 100 : 0}%`
                }}
              ></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};