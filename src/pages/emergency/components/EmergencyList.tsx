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
  const [ selected, setSelected ] = useState<string | number>( "active" );
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
    return <UI.Spinner />;
  }

  if ( !emergencies ) return null;

  const columns = [
    { name: "Título", uid: "title", sortable: true },
    { name: "Estado", uid: "status", sortable: true },
    { name: "Fecha", uid: "date", sortable: true },
    { name: "Visto", uid: "seen", sortable: true },
    { name: "Descripción", uid: "description", sortable: true },
    { name: "Usuario", uid: "user", sortable: true },
    { name: "Teléfono", uid: "phone", sortable: true },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  const transformedEmergencies = emergencies.map( emergency => ( {
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
            color="primary"
            variant="light"
            onPress={ () => {
              setEmergencyToEnd( emergency );
              onOpen();
            } }
            startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> }
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
    <div className="flex w-full flex-col">
      <UI.Tabs
        aria-label="Options"
        selectedKey={ selected }
        onSelectionChange={ setSelected }
        classNames={{
          tabList: "gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg",
          cursor: "bg-white dark:bg-gray-700 shadow-sm",
          tab: "px-4 py-2 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white",
          tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white"
        }}
      >
        <UI.Tab
          key="active"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoAlertCircleOutline size={ 14 } />
              <span>Activas</span>
            </div>
          }
        >
          <CustomTable
            data={ getFilteredEmergencies( "active" ) }
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
            title="emergencias activas"
          />
        </UI.Tab>
        <UI.Tab
          key="ended"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoCheckmarkOutline size={ 14 } />
              <span>Finalizadas</span>
            </div>
          }
        >
          <CustomTable
            data={ getFilteredEmergencies( "ended" ) }
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
            title="emergencias finalizadas"
          />
        </UI.Tab>
        <UI.Tab
          key="all"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoMegaphoneOutline size={ 14 } />
              <span>Todas las emergencias</span>
            </div>
          }
        >
          <CustomTable
            data={ getFilteredEmergencies( "all" ) }
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
            title="emergencias"
          />
        </UI.Tab>
      </UI.Tabs>

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
                <UI.Button color="primary" onPress={ handleConfirm } isLoading={ isEndingEmergency } startContent={ !isEndingEmergency && <Icons.IoCheckmarkOutline size={ 24 } /> }>
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
