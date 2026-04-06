import { useState, useEffect, useMemo } from 'react';

import { CustomTable, Icons, StatusColorMap, UI, useDisclosure, IconContainer } from '../../../shared';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceSearch } from './InvoiceSearch';
import { useInvoices, useConfirmInvoice } from '../hooks';
import { useAuthStore } from '../../auth';
import { IInvoice } from '../interfaces/IInvoice';
import { formatDate } from '../helper';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';

export const InvoiceList = () => {
  const { invoices, isLoading, refetch } = useInvoices();
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [invoiceToConfirm, setInvoiceToConfirm] = useState<IInvoice | null>(null);
  const [selectedTab, setSelectedTab] = useState("in_progress");
  const [searchTerm, setSearchTerm] = useState<string>('');
  const confirmInvoiceMutation = useConfirmInvoice();
  const { markAsSeen } = useSeenNotifications();

  const isConfirmingInvoice = confirmInvoiceMutation.isPending;

  // Filtrar expensas por usuario y búsqueda
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    // Si es usuario normal (no admin), solo mostrar sus propias expensas
    let userFilteredInvoices = invoices;
    if (!user?.roles?.includes('admin')) {
      userFilteredInvoices = invoices.filter(invoice => invoice.user.id === user?.id);
    }

    // Aplicar filtro de búsqueda
    if (!searchTerm.trim()) return userFilteredInvoices;

    const searchLower = searchTerm.toLowerCase().trim();
    return userFilteredInvoices.filter(invoice =>
      invoice.title.toLowerCase().includes(searchLower) ||
      invoice.description?.toLowerCase().includes(searchLower) ||
      invoice.user.name.toLowerCase().includes(searchLower) ||
      invoice.user.lastName.toLowerCase().includes(searchLower)
    );
  }, [invoices, searchTerm, user]);

  // Handle confirming invoice - integrate with notification system
  const handleConfirmInvoice = async () => {
    if (invoiceToConfirm) {
      try {
        // Confirm invoice in the backend
        await confirmInvoiceMutation.confirmInvoiceMutation({ id: invoiceToConfirm.id, invoice: invoiceToConfirm });
        // Also mark as seen in the notification system
        markAsSeen('invoices', invoiceToConfirm.id);
        onClose();
        setInvoiceToConfirm(null);
      } catch (error) {
        console.error('Error confirming invoice:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // Reducido de 5s a 30s para evitar conflictos con mutations

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!invoices) return null;

  const columns = [
    { name: "Título", uid: "title" },
    { name: "Estado", uid: "state" },
    { name: "Fecha", uid: "date" },
    { name: "Propiedad", uid: "property" },
    { name: "Teléfono notificación", uid: "phone" },
    { name: "URL", uid: "invoiceUrl" },
    { name: "Opciones", uid: "actions" }
  ];

  const getFilteredInvoices = (filter: string | number) => {
    let filtered: IInvoice[] = [];

    switch (filter) {
      case "in_progress":
        filtered = filteredInvoices.filter(invoice => invoice.state === 'in_progress');
        break;
      case "confirmed":
        filtered = filteredInvoices.filter(invoice => invoice.state === 'confirmed');
        break;
      case "all":
      default:
        filtered = filteredInvoices;
        break;
    }

    return filtered
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(invoice => ({
        ...invoice,
        date: formatDate(invoice.date),
        property: invoice.property ? (invoice.property.isMain ? `🏠 ${invoice.property.address}` : invoice.property.address) : 'N/A',
        phone: (invoice.property?.users && invoice.property.users.length > 0)
          ? invoice.property.users.map((user: any) => user.phone).filter((phone: any) => phone).join(', ') || 'Sin teléfono'
          : 'Sin propietarios',
        state: invoice.state === 'confirmed'
          ? <UI.Chip color="success" startContent={<Icons.IoCheckmarkOutline size={18} />} variant="flat">Aprobada</UI.Chip>
          : <UI.Chip color="warning" startContent={<Icons.IoTimeOutline size={18} />} variant="flat">Pendiente</UI.Chip>,
        invoiceUrl: (
          <UI.Button
            as="a"
            href={invoice.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="light"
            startContent={<Icons.IoLinkOutline size={18} />}
            className="text-blue-600 hover:text-blue-800"
          >
            Ver Expensa
          </UI.Button>
        ),
        actions: (
          <div className="flex space-x-2 items-center">
            {user?.roles?.includes('admin') && invoice.state === 'in_progress' && (
              <UI.Button
                color="success"
                variant="solid"
                onPress={() => {
                  setInvoiceToConfirm(invoice);
                  onOpen();
                }}
                startContent={<Icons.IoCheckmarkOutline size={18} />}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Aprobar Expensa
              </UI.Button>
            )}
            {(user?.roles?.includes('admin') || invoice.user.id === user?.id) && (
              <InvoiceForm id={invoice.id} />
            )}
          </div>
        )
      }));
  };

  const addButtonComponent = <InvoiceForm />;

  const handleConfirm = () => {
    handleConfirmInvoice();
  };

  const statusColorMap: StatusColorMap = {
    confirmed: "success",
    in_progress: "warning",
  };

  const visibleColumns = ["title", "state", "date", "property", "phone", "invoiceUrl", "actions"];

  return (
    <div className="flex w-full flex-col space-y-6 lg:space-y-8">
      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <InvoiceSearch
            onSearch={setSearchTerm}
            placeholder="Buscar por título, descripción o usuario..."
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Icons.IoReceiptOutline size={16} />
          <span>
            {searchTerm ?
              `${filteredInvoices.length} de ${invoices?.length || 0} expensas` :
              `${filteredInvoices.length} expensas`
            }
          </span>
        </div>
      </div>

      <div className="w-full space-y-3 lg:space-y-4">
        <div className="flex justify-center w-full">
          <UI.Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            aria-label="Invoice tabs"
            size="lg"
            classNames={{
              tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
              cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
              tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
              tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
            }}
          >
            <UI.Tab key="in_progress" title={
              <div className="flex items-center gap-2 sm:gap-3">
                <Icons.IoTimeOutline size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Pendientes</span>
                <span className="sm:hidden">Pend.</span>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
                  {getFilteredInvoices("in_progress").length}
                </span>
              </div>
            } />
            <UI.Tab key="confirmed" title={
              <div className="flex items-center gap-2 sm:gap-3">
                <Icons.IoCheckmarkOutline size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Aprobadas</span>
                <span className="sm:hidden">Apr.</span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
                  {getFilteredInvoices("confirmed").length}
                </span>
              </div>
            } />
          </UI.Tabs>
        </div>

        <div className="w-full">
          <CustomTable
            data={getFilteredInvoices(selectedTab)}
            columns={columns}
            statusColorMap={statusColorMap}
            initialVisibleColumns={visibleColumns}
            addButtonComponent={addButtonComponent}
            title={selectedTab === 'in_progress' ? "expensas pendientes" : "expensas aprobadas"}
            className="w-full"
          />
        </div>
      </div>

      <UI.Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" isDismissable={false} scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          <>
            <UI.ModalHeader className="flex justify-center flex-row space-x-2 items-center">
              <IconContainer children={<Icons.IoReceiptOutline size={24} />} />
              <h2>Aprobar expensa</h2>
            </UI.ModalHeader>
            <UI.ModalBody>
              <p className="text-2xl text-center">¿Estás seguro de que deseas aprobar esta expensa?</p>
              <div className="mt-4 flex flex-col justify-center">
                <h2 className="text-xl font-bold">{invoiceToConfirm?.title}</h2>
                <p>{invoiceToConfirm?.description}</p>
              </div>
            </UI.ModalBody>
            <UI.ModalFooter className="flex justify-center flex-row space-x-2 items-center">
              <UI.Button color="danger" variant="light" onPress={onClose} isDisabled={isConfirmingInvoice} startContent={<Icons.IoArrowBackOutline size={24} />}>
                Cancelar
              </UI.Button>
              <UI.Button
                color="success"
                variant="solid"
                onPress={handleConfirm}
                isLoading={isConfirmingInvoice}
                startContent={!isConfirmingInvoice && <Icons.IoCheckmarkOutline size={24} />}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Aprobar
              </UI.Button>
            </UI.ModalFooter>
          </>
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};