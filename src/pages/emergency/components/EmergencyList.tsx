import { useState, useEffect } from 'react';

import { CustomTable, Icons, StatusColorMap, UI, useDisclosure, IconContainer, useWhatsApp, UserModal } from '../../../shared';
import { EmergencyForm } from './EmergencyForm';
import { useEmergencies, useEndEmergency, useMarkAsSeenEmergency } from '../hooks';
import { useAuthStore } from '../../auth';
import { IEmergency } from '../interfaces';
import { formatDate } from '../../package';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';



export const EmergencyList = () => {

  const { emergencies, isLoading, refetch } = useEmergencies();
  const { user } = useAuthStore( ( state ) => ( { user: state.user } ) );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [ emergencyToEnd, setEmergencyToEnd ] = useState<IEmergency | null>( null );
  const [ selectedTab, setSelectedTab ] = useState( "active" );
  const endEmergencyMutation = useEndEmergency();
  const markAsSeenMutation = useMarkAsSeenEmergency();
  const { generateWhatsAppLink } = useWhatsApp();
  const { markAsSeen } = useSeenNotifications();

  const isEndingEmergency = endEmergencyMutation.isPending;
  const isMarkingAsSeen = markAsSeenMutation.isPending;

  // Handle marking emergency as seen - integrate with notification system
  const handleMarkAsSeen = async (emergencyId: string) => {
    try {
      // Mark as seen in the backend
      await markAsSeenMutation.mutateAsync(emergencyId);
      // Also mark as seen in the notification system
      markAsSeen('emergencies', emergencyId);
    } catch (error) {
      console.error('Error marking emergency as seen:', error);
    }
  };

  useEffect( () => {
    const interval = setInterval( () => {
      refetch();
    }, 5000 );

    return () => clearInterval( interval );
  }, [ refetch ] );

  if ( isLoading ) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if ( !emergencies ) return null;

  const columns = [
    { name: "Título", uid: "title" },
    { name: "Estado", uid: "status" },
    { name: "Fecha", uid: "date" },
    { name: "Visto", uid: "seen" },
    { name: "Descripción", uid: "description" },
    { name: "Usuario", uid: "user" },
    { name: "Teléfono", uid: "phone" },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  const transformedEmergencies = emergencies
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map( emergency => ( {
    ...emergency,
    date: formatDate( emergency.date ),
    user: (
      <UserModal user={emergency.user}>
        {`${ emergency.user.lastName }, ${ emergency.user.name }`}
      </UserModal>
    ),
    phone: generateWhatsAppLink( emergency.user.phone ),
    status: emergency.emergencyEnded
      ? <UI.Chip color="success" startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> } variant="flat">Finalizada</UI.Chip>
      : <UI.Chip color="danger" startContent={ <Icons.IoAlertCircleOutline size={ 18 } /> } variant="flat">Activa</UI.Chip>,
    seen: emergency.seen
      ? <UI.Chip color="success" startContent={ <Icons.IoEyeOutline size={ 18 } /> } variant="flat">Visto</UI.Chip>
      : <UI.Chip color="warning" startContent={ <Icons.IoEyeOffOutline size={ 18 } /> } variant="flat">No visto</UI.Chip>,
    actions: (
      <div className="flex space-x-2 items-center">
        { user?.roles?.includes( 'security' ) && !emergency.seen && (
          <UI.Button
            color="secondary"
            variant="solid"
            onPress={ () => handleMarkAsSeen( emergency.id ) }
            isLoading={ isMarkingAsSeen }
            startContent={ !isMarkingAsSeen && <Icons.IoEyeOutline size={ 18 } /> }
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Marcar como visto
          </UI.Button>
        ) }
        { !emergency.seen && user?.roles?.includes( 'security' ) && (
          <UI.Chip color="danger" variant="dot">
            Atención requerida
          </UI.Chip>
        ) }
        { ( user?.roles?.includes( 'admin' ) || user?.roles?.includes( 'security' ) || emergency.user.id === user?.id ) && !emergency.emergencyEnded && (
          <UI.Button
            color="success"
            variant="solid"
            onPress={ () => {
              setEmergencyToEnd( emergency );
              onOpen();
            } }
            startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> }
            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 pulse-animation"
          >
            Finalizar emergencia
          </UI.Button>
        ) }
      </div>
    )
  } ) );

  const handleConfirm = () => {
    if ( emergencyToEnd ) {
      endEmergencyMutation.mutate( emergencyToEnd.id );
      onClose();
      setEmergencyToEnd( null );
    }
  };

  const getFilteredEmergencies = ( filter: string | number ) => {
    switch ( filter ) {
      case "active":
        return transformedEmergencies.filter( emergency => !emergency.emergencyEnded );
      case "ended":
        return transformedEmergencies.filter( emergency => emergency.emergencyEnded );
      case "all":
      default:
        return transformedEmergencies;
    }
  };

  const addButtonComponent = user?.roles?.includes( 'security' ) ? null : <EmergencyForm />;

  return (
    <div className="w-full space-y-3 lg:space-y-4">
      <div className="flex justify-center w-full">
        <UI.Tabs
          selectedKey={ selectedTab }
          onSelectionChange={ ( key ) => setSelectedTab( key as string ) }
          aria-label="Emergency tabs"
          size="lg"
          classNames={ {
            tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
            cursor: "bg-white dark:bg-gray-700 shadow-sm rounded-md sm:rounded-lg",
            tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
            tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
          } }
        >
          <UI.Tab key="active" title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoAlertCircleOutline size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Pendientes</span>
              <span className="sm:hidden">Pend.</span>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
                {getFilteredEmergencies("active").length}
              </span>
            </div>
          } />
          <UI.Tab key="ended" title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoCheckmarkOutline size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Finalizadas</span>
              <span className="sm:hidden">Fin.</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
                {getFilteredEmergencies("ended").length}
              </span>
            </div>
          } />
        </UI.Tabs>
      </div>

      <div className="w-full">
        <CustomTable
          data={ getFilteredEmergencies( selectedTab ) }
          columns={ columns }
          statusColorMap={ statusColorMap }
          initialVisibleColumns={ [
            "title",
            "status",
            "date",
            "seen",
            "description",
            "user",
            "phone",
            "actions"
          ] }
          addButtonComponent={ addButtonComponent }
          title={ selectedTab === 'active' ? "emergencias pendientes" : "emergencias finalizadas" }
          className="w-full"
        />
      </div>

      <UI.Modal isOpen={ isOpen } onOpenChange={ onOpenChange } backdrop="blur" isDismissable={ false } scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          { ( onClose ) => (
            <>
              <UI.ModalHeader className="flex justify-center flex-row space-x-2 items-center">
                <IconContainer children={ <Icons.IoMegaphoneOutline size={ 24 } /> } />
                <h2>Confirmar finalización</h2>
              </UI.ModalHeader>
              <UI.ModalBody>
                <p className="text-2xl text-center">¿Estás seguro de que deseas finalizar esta emergencia?</p>
                <div className="mt-4 flex flex-col justify-center">
                  <h2 className="text-xl font-bold">{ emergencyToEnd?.title }</h2>
                  <p>{ emergencyToEnd?.description }</p>
                </div>
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center flex-row space-x-2 items-center">
                <UI.Button color="danger" variant="light" onPress={ onClose } isDisabled={ isEndingEmergency } startContent={ <Icons.IoArrowBackOutline size={ 24 } /> }>
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="success"
                  variant="solid"
                  onPress={ handleConfirm }
                  isLoading={ isEndingEmergency }
                  startContent={ !isEndingEmergency && <Icons.IoCheckmarkOutline size={ 24 } /> }
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
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
