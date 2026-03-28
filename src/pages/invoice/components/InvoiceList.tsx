import { useState, useEffect } from 'react';

import { CustomTable, Icons, StatusColorMap, UI, useDisclosure, IconContainer, UserModal } from '../../../shared';
import { InvoiceForm } from './InvoiceForm';
import { useInvoices, useConfirmInvoice } from '../hooks';
import { useAuthStore } from '../../auth';
import { IInvoice } from '../interfaces';
import { formatDate } from '../helper';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';

export const InvoiceList = () => {
  const { invoices, isLoading, refetch } = useInvoices();
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [invoiceToConfirm, setInvoiceToConfirm] = useState<IInvoice | null>(null);
  const [selected, setSelected] = useState<string | number>("in_progress");
  const confirmInvoiceMutation = useConfirmInvoice();
  const { markAsSeen } = useSeenNotifications();

  const isConfirmingInvoice = confirmInvoiceMutation.isPending;

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

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  const transformedInvoices = invoices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(invoice => ({
    ...invoice,
    date: formatDate(invoice.date),
    user: (
      <UserModal user={invoice.user}>
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
      </div>
    )
  }));

  const handleConfirm = () => {
    handleConfirmInvoice();
  };

  const getFilteredInvoices = (filter: string | number) => {
    switch (filter) {
      case "in_progress":
        return transformedInvoices.filter(invoice => invoice.state === 'in_progress');
      case "confirmed":
        return transformedInvoices.filter(invoice => invoice.state === 'confirmed');
      case "all":
      default:
        return transformedInvoices;
    }
  };

  const addButtonComponent = <InvoiceForm />;

  return (
    <div className="flex w-full flex-col space-y-6 lg:space-y-8">
      <UI.Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={setSelected}
        size="lg"
        classNames={{
          tabList: "gap-2 sm:gap-3 lg:gap-4 bg-gray-100 dark:bg-gray-800 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-full sm:w-auto flex-wrap sm:flex-nowrap",
          cursor: "bg-white dark:bg-gray-700 shadow-sm rounded-md sm:rounded-lg",
          tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base min-w-0 flex-shrink-0",
          tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
        }}
      >
        <UI.Tab
          key="in_progress"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoTimeOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">En Proceso</span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredInvoices("in_progress").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
            <CustomTable
              data={getFilteredInvoices("in_progress")}
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
              title="facturas en proceso"
              className="w-full"
            />
          </div>
        </UI.Tab>
        <UI.Tab
          key="confirmed"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoCheckmarkOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Confirmadas</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredInvoices("confirmed").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
            <CustomTable
              data={getFilteredInvoices("confirmed")}
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
              title="facturas confirmadas"
              className="w-full"
            />
          </div>
        </UI.Tab>
        <UI.Tab
          key="all"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoReceiptOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate hidden sm:inline">Todas las facturas</span>
              <span className="truncate sm:hidden">Todas</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredInvoices("all").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
            <CustomTable
              data={getFilteredInvoices("all")}
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
              title="facturas"
              className="w-full"
            />
          </div>
        </UI.Tab>
      </UI.Tabs>

      <UI.Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" isDismissable={false} scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          {(onClose) => (
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
          )}
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};