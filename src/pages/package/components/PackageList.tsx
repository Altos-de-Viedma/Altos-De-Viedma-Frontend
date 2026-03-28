import React from "react";

import { CustomTable, Icons, StatusColorMap, UI, useWhatsApp, useDisclosure, IconContainer, UserModal } from '../../../shared';
import { PackageForm } from './PackageForm';
import { usePackages, useMarkAsReceived } from '../hooks';
import { useAuthStore } from '../../auth';
import { formatDate } from '../helper';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';


export const PackageList = () => {

  const { packages, isLoading } = usePackages();
  const { generateWhatsAppLink } = useWhatsApp();
  const { markAsReceived, isPending: isMarkingAsReceived } = useMarkAsReceived();
  const [ selected, setSelected ] = React.useState<string | number>( "pending" );
  const { user } = useAuthStore( ( state ) => ( { user: state.user } ) );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [ packageToMark, setPackageToMark ] = React.useState<any | null>( null );
  const { markAsSeen } = useSeenNotifications();

  // Handle marking package as received - integrate with notification system
  const handleMarkAsReceived = async () => {
    if ( packageToMark ) {
      try {
        // Mark as received in the backend
        await markAsReceived( packageToMark.id );
        // Also mark as seen in the notification system (removes notification)
        markAsSeen('packages', packageToMark.id);
        onClose();
        setPackageToMark( null );
      } catch (error) {
        console.error('Error marking package as received:', error);
      }
    }
  };

  if ( !user ) return null;

  const columns = [
    { name: "Título", uid: "title" },
    { name: "Estado", uid: "receivedStatus" },
    { name: "Fecha de creación", uid: "date" },
    { name: "Fecha estimada de recepción", uid: "arrivalDate" },
    { name: "Descripción", uid: "description" },
    { name: "Propietario", uid: "user" },
    { name: "Propiedad", uid: "property" },
    { name: "Teléfono", uid: "phone" },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if ( isLoading ) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if ( !packages ) return null;


  const transformedPackages = packages
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map( pkg => ( {
    ...pkg,
    date: formatDate( pkg.date ),
    arrivalDate: formatDate( pkg.arrivalDate ),
    user: (
      <UserModal user={pkg.user}>
        {`${ pkg.user.lastName }, ${ pkg.user.name }`}
      </UserModal>
    ),
    phone: generateWhatsAppLink( pkg.user.phone ),
    property: pkg.property.isMain ? `🏠 ${ pkg.property.address }` : pkg.property.address,
    receivedStatus: pkg.received
      ? <UI.Chip color="success" startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> } variant="flat">Recibido</UI.Chip>
      : <UI.Chip color="secondary" startContent={ <Icons.IoAlertCircleOutline size={ 18 } /> } variant="flat">No recibido</UI.Chip>,
    actions: ( user?.roles?.includes( 'security' ) || pkg.user.id === user.id ) ? (
      !pkg.received && (
        <UI.Button
          color="success"
          variant="solid"
          onPress={ () => {
            setPackageToMark( pkg );
            onOpen();
          } }
          startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> }
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          Marcar como recibido
        </UI.Button>
      )
    ) : (
      <PackageForm id={ pkg.id } />
    )
  } ) );

  const getFilteredPackages = ( filter: string | number ) => {
    switch ( filter ) {
      case "pending":
        return transformedPackages.filter( pkg => !pkg.received );
      case "received":
        return transformedPackages.filter( pkg => pkg.received );
      case "all":
      default:
        return transformedPackages;
    }
  };

  const addButtonComponent = user?.roles?.includes( 'security' ) ? null : <PackageForm />;

  const handleConfirm = () => {
    handleMarkAsReceived();
  };

  return (
    <div className="flex w-full flex-col space-y-6 lg:space-y-8">
      <UI.Tabs
        aria-label="Options"
        selectedKey={ selected }
        onSelectionChange={ setSelected }
        size="lg"
        classNames={{
          tabList: "gap-2 sm:gap-3 lg:gap-4 bg-gray-100 dark:bg-gray-800 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-full sm:w-auto flex-wrap sm:flex-nowrap",
          cursor: "bg-white dark:bg-gray-700 shadow-sm rounded-md sm:rounded-lg",
          tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base min-w-0 flex-shrink-0",
          tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
        }}
      >
        <UI.Tab
          key="pending"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoAlertCircleOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Pendientes</span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredPackages("pending").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
            <CustomTable
              data={ getFilteredPackages( "pending" ) }
              columns={ columns }
              statusColorMap={ statusColorMap }
              initialVisibleColumns={ [
                "title",
                "receivedStatus",
                "date",
                "arrivalDate",
                "description",
                "user",
                "property",
                "phone",
                "actions"
              ] }
              addButtonComponent={ addButtonComponent }
              title="paquetes pendientes"
              className="w-full"
            />
          </div>
        </UI.Tab>
        <UI.Tab
          key="received"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoCheckmarkOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Recibidos</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredPackages("received").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
            <CustomTable
              data={ getFilteredPackages( "received" ) }
              columns={ columns }
              statusColorMap={ statusColorMap }
              initialVisibleColumns={ [
                "title",
                "receivedStatus",
                "date",
                "arrivalDate",
                "description",
                "user",
                "property",
                "phone",
                "actions"
              ] }
              addButtonComponent={ addButtonComponent }
              title="paquetes recibidos"
              className="w-full"
            />
          </div>
        </UI.Tab>
        <UI.Tab
          key="all"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoCubeOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate hidden sm:inline">Todos los paquetes</span>
              <span className="truncate sm:hidden">Todos</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredPackages("all").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
            <CustomTable
              data={ getFilteredPackages( "all" ) }
              columns={ columns }
              statusColorMap={ statusColorMap }
              initialVisibleColumns={ [
                "title",
                "receivedStatus",
                "date",
                "arrivalDate",
                "description",
                "user",
                "property",
                "phone",
                "actions"
              ] }
              addButtonComponent={ addButtonComponent }
              title="paquetes"
              className="w-full"
            />
          </div>
        </UI.Tab>
      </UI.Tabs>

      <UI.Modal isOpen={ isOpen } onOpenChange={ onOpenChange } backdrop="blur" isDismissable={ false } scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          { ( onClose ) => (
            <>
              <UI.ModalHeader className="flex justify-center flex-row space-x-2 items-center">
                <IconContainer children={ <Icons.IoCubeOutline size={ 24 } /> } />
                <h2>Confirmar recepción</h2>
              </UI.ModalHeader>
              <UI.ModalBody>
                <p className="text-2xl text-center">¿Estás seguro de que deseas marcar este paquete como recibido?</p>
                <div className="mt-4 flex flex-col justify-center">
                  <h2 className="text-xl font-bold">{ packageToMark?.title }</h2>
                  <p>{ packageToMark?.description }</p>
                </div>
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center flex-row space-x-2 items-center">
                <UI.Button color="danger" variant="light" onPress={ onClose } isDisabled={ isMarkingAsReceived } startContent={ <Icons.IoArrowBackOutline size={ 24 } /> }>
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="success"
                  variant="solid"
                  onPress={ handleConfirm }
                  isLoading={ isMarkingAsReceived }
                  startContent={ !isMarkingAsReceived && <Icons.IoCheckmarkOutline size={ 24 } /> }
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Confirmar
                </UI.Button>
              </UI.ModalFooter>
            </>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};
