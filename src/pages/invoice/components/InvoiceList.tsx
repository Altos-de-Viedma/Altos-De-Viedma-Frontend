import { useState, useEffect, useMemo } from 'react';

import { CustomTable, Icons, StatusColorMap, UI, useDisclosure, IconContainer, UserModal } from '../../../shared';
import { InvoiceForm } from './InvoiceForm';
import { InvoiceSearch } from './InvoiceSearch';
import { useInvoices, useConfirmInvoice, useDeleteInvoice } from '../hooks';
import { useAuthStore } from '../../auth';
import { IInvoice } from '../interfaces/IInvoice';
import { formatDate } from '../helper';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';

export const InvoiceList = () => {
  const { invoices, isLoading, refetch } = useInvoices();
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose } = useDisclosure();
  const [invoiceToConfirm, setInvoiceToConfirm] = useState<IInvoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<IInvoice | null>(null);
  const [selectedTab, setSelectedTab] = useState("in_progress");
  const [searchTerm, setSearchTerm] = useState<string>('');
  const confirmInvoiceMutation = useConfirmInvoice();
  const { removeInvoice, isPending: isDeletingInvoice } = useDeleteInvoice();
  const { markAsSeen } = useSeenNotifications();

  const isConfirmingInvoice = confirmInvoiceMutation.isPending;

  // Filtrar facturas por búsqueda - MOVER ANTES DE LOS RETURNS CONDICIONALES
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    if (!searchTerm.trim()) return invoices;

    const searchLower = searchTerm.toLowerCase().trim();
    return invoices.filter(invoice =>
      invoice.title.toLowerCase().includes(searchLower) ||
      invoice.description?.toLowerCase().includes(searchLower) ||
      invoice.user.name.toLowerCase().includes(searchLower) ||
      invoice.user.lastName.toLowerCase().includes(searchLower)
    );
  }, [invoices, searchTerm]);

  // Handle confirming invoice - integrate with notification system
  const handleConfirmInvoice = async () => {
    if (invoiceToConfirm) {
      try {
        // Confirm invoice in the backend
        await confirmInvoiceMutation.confirmInvoiceMutation(invoiceToConfirm.id);
        // Also mark as seen in the notification system
        markAsSeen('invoices', invoiceToConfirm.id);
        onClose();
        setInvoiceToConfirm(null);
      } catch (error) {
        console.error('Error confirming invoice:', error);
      }
    }
  };

  // Handle deleting invoice
  const handleDeleteInvoice = async () => {
    if (invoiceToDelete) {
      try {
        await removeInvoice(invoiceToDelete.id);
        onDeleteClose();
        setInvoiceToDelete(null);
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

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
    { name: "Descripción", uid: "description" },
    { name: "Usuario", uid: "user" },
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
        user: (
          <UserModal user={invoice.user as any}>
            {`${invoice.user.lastName}, ${invoice.user.name}`}
          </UserModal>
        ),
        state: invoice.state === 'confirmed'
          ? <UI.Chip color="success" startContent={<Icons.IoCheckmarkOutline size={18} />} variant="flat">Confirmada</UI.Chip>
          : <UI.Chip color="warning" startContent={<Icons.IoTimeOutline size={18} />} variant="flat">En proceso</UI.Chip>,
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
            Ver Factura
          </UI.Button>
        ),
        actions: (
          <div className="flex space-x-2 items-center">
            {(user?.roles?.includes('admin') || user?.roles?.includes('security')) && invoice.state === 'in_progress' && (
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
                Confirmar Factura
              </UI.Button>
            )}
            {(user?.roles?.includes('admin') || invoice.user.id === user?.id) && (
              <InvoiceForm id={invoice.id} />
            )}
            {(user?.roles?.includes('admin') || invoice.user.id === user?.id) && (
              <UI.Button
                color="danger"
                variant="solid"
                onPress={() => {
                  setInvoiceToDelete(invoice);
                  onDeleteOpen();
                }}
                startContent={<Icons.IoTrashOutline size={18} />}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Eliminar
              </UI.Button>
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
              `${filteredInvoices.length} de ${invoices?.length || 0} facturas` :
              `${filteredInvoices.length} facturas`
            }
          </span>
        </div>
      </div>

      <div className="w-full space-y-6 lg:space-y-8">
        <div className="flex justify-center w-full">
          <UI.Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            aria-label="Invoice tabs"
            size="lg"
            classNames={{
              tabList: "gap-2 sm:gap-3 lg:gap-4 bg-gray-100 dark:bg-gray-800 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
              cursor: "bg-white dark:bg-gray-700 shadow-sm rounded-md sm:rounded-lg",
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
            initialVisibleColumns={[
              "title",
              "state",
              "date",
              "description",
              "user",
              "invoiceUrl",
              "actions"
            ]}
            addButtonComponent={addButtonComponent}
            title={selectedTab === 'in_progress' ? "facturas pendientes" : "facturas aprobadas"}
            className="w-full"
          />
        </div>
      </div>

      <UI.Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" isDismissable={false} scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          <>
            <UI.ModalHeader className="flex justify-center flex-row space-x-2 items-center">
              <IconContainer children={<Icons.IoReceiptOutline size={24} />} />
              <h2>Confirmar factura</h2>
            </UI.ModalHeader>
            <UI.ModalBody>
              <p className="text-2xl text-center">¿Estás seguro de que deseas confirmar esta factura?</p>
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
                Confirmar
              </UI.Button>
            </UI.ModalFooter>
          </>
        </UI.ModalContent>
      </UI.Modal>

      {/* Delete Confirmation Modal */}
      <UI.Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} backdrop="blur" isDismissable={false} scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          <>
            <UI.ModalHeader className="flex justify-center flex-row space-x-2 items-center">
              <IconContainer children={<Icons.IoTrashOutline size={24} />} />
              <h2>Eliminar factura</h2>
            </UI.ModalHeader>
            <UI.ModalBody>
              <p className="text-2xl text-center">¿Estás seguro de que deseas eliminar esta factura?</p>
              <div className="mt-4 flex flex-col justify-center">
                <h2 className="text-xl font-bold">{invoiceToDelete?.title}</h2>
                <p>{invoiceToDelete?.description}</p>
                <p className="text-red-600 font-semibold mt-2">Esta acción no se puede deshacer.</p>
              </div>
            </UI.ModalBody>
            <UI.ModalFooter className="flex justify-center flex-row space-x-2 items-center">
              <UI.Button color="default" variant="light" onPress={onDeleteClose} isDisabled={isDeletingInvoice} startContent={<Icons.IoArrowBackOutline size={24} />}>
                Cancelar
              </UI.Button>
              <UI.Button
                color="danger"
                variant="solid"
                onPress={handleDeleteInvoice}
                isLoading={isDeletingInvoice}
                startContent={!isDeletingInvoice && <Icons.IoTrashOutline size={24} />}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Eliminar
              </UI.Button>
            </UI.ModalFooter>
          </>
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};