import { useState } from 'react';
import { CustomTable, Icons, StatusColorMap, UI, useWhatsApp, useDisclosure, IconContainer } from '../../../shared';
import { IVisitor } from '../interfaces/IVisitor';
import { useDate } from '../helper';
import { useVisitCompleted, useVisitors } from '../hooks';
import { VisitorForm } from './VisitorForm';
import { useAuthStore } from '../../auth';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';



export const VisitorsList = () => {
  const { formatDate } = useDate();
  const { generateWhatsAppLink } = useWhatsApp();
  const { visitors, isLoading } = useVisitors();
  const { completedVisit, isPending: isCompletingVisit } = useVisitCompleted();
  const [ selected, setSelected ] = useState<string | number>( "pending" );
  const { user } = useAuthStore( ( state ) => ( { user: state.user } ) );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [ visitorToComplete, setVisitorToComplete ] = useState<IVisitor | null>( null );
  const { markAsSeen } = useSeenNotifications();

  // Handle completing visit - integrate with notification system
  const handleCompleteVisit = async () => {
    if ( visitorToComplete ) {
      try {
        // Complete the visit in the backend
        await completedVisit( visitorToComplete.id );
        // Also mark as seen in the notification system (removes notification)
        markAsSeen('visitors', visitorToComplete.id);
        onClose();
        setVisitorToComplete( null );
      } catch (error) {
        console.error('Error completing visit:', error);
      }
    }
  };

  if ( isLoading ) {
    return <UI.Spinner />;
  }

  if ( !visitors || !user ) return null;

  const columns = [
    { name: "Foto", uid: "profilePicture" },
    { name: "Nombre completo", uid: "fullName", sortable: true },
    { name: "Ingreso", uid: "date", sortable: true },
    { name: "Fecha de salida estimada", uid: "dateAndTimeOfVisit", sortable: true },
    { name: "D.N.I.", uid: "dni", sortable: true },
    { name: "Teléfono", uid: "phone", sortable: true },
    { name: "Descripción", uid: "description", sortable: true },
    { name: "Patente", uid: "vehiclePlate", sortable: true },
    { name: "Propiedad", uid: "property", sortable: true },
    { name: "Estado", uid: "visitCompleted", sortable: true },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  const canCompleteVisit = ( visitor: IVisitor ) => {
    return user.roles?.includes( 'admin' ) ||
      user.roles?.includes( 'security' ) ||
      visitor.property.user.id === user.id;
  };

  const transformVisitor = ( visitor: IVisitor ) => ( {
    ...visitor,
    date: formatDate( visitor.date.toString() ),
    profilePicture: <UI.Avatar className="w-10 h-10 text-tiny" src={ visitor.profilePicture } />,
    dateAndTimeOfVisit: formatDate( visitor.dateAndTimeOfVisit ),
    property: visitor.property.isMain ? `🏠 ${ visitor.property.address }` : visitor.property.address,
    phone: generateWhatsAppLink( visitor.phone ),
    visitCompleted: visitor.visitCompleted
      ? <UI.Chip color="success" startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> } variant="flat">Finalizada</UI.Chip>
      : <UI.Chip color="secondary" startContent={ <Icons.IoAlertCircleOutline size={ 18 } /> } variant="flat">En curso</UI.Chip>,
    actions: (
      <div className="flex flex-row space-x-2">
        <VisitorForm id={ visitor.id } />
        { !visitor.visitCompleted && canCompleteVisit( visitor ) && (
          <UI.Button
            color="primary"
            variant="light"
            onPress={ () => {
              setVisitorToComplete( visitor );
              onOpen();
            } }
            startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> }
          >
            Finalizar visita
          </UI.Button>
        ) }
      </div>
    )
  } );

  const getFilteredVisitors = ( filter: string | number ) => {
    switch ( filter ) {
      case "pending":
        return visitors.filter( visitor => !visitor.visitCompleted ).map( transformVisitor );
      case "completed":
        return visitors.filter( visitor => visitor.visitCompleted ).map( transformVisitor );
      case "all":
      default:
        return visitors.map( transformVisitor );
    }
  };

  const handleConfirm = () => {
    handleCompleteVisit();
  };

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
          key="pending"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoAlertCircleOutline size={ 14 } />
              <span>Visitantes</span>
            </div>
          }
        >
          <CustomTable
            data={ getFilteredVisitors( "pending" ) }
            columns={ columns }
            statusColorMap={ statusColorMap }
            initialVisibleColumns={ [
              "profilePicture",
              "fullName",
              "date",
              "dateAndTimeOfVisit",
              "dni",
              "phone",
              "vehiclePlate",
              "description",
              "property",
              "visitCompleted",
              "actions",
            ] }
            addButtonComponent={ <VisitorForm /> }
            title="visitantes pendientes"
          />
        </UI.Tab>
        <UI.Tab
          key="completed"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoCheckmarkOutline size={ 14 } />
              <span>Visitas finalizadas</span>
            </div>
          }
        >
          <CustomTable
            data={ getFilteredVisitors( "completed" ) }
            columns={ columns }
            statusColorMap={ statusColorMap }
            initialVisibleColumns={ [
              "profilePicture",
              "fullName",
              "date",
              "dateAndTimeOfVisit",
              "dni",
              "phone",
              "description",
              "vehiclePlate",
              "property",
              "visitCompleted",
              "actions",
            ] }
            addButtonComponent={ <VisitorForm /> }
            title="visitas finalizadas"
          />
        </UI.Tab>
        <UI.Tab
          key="all"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoPeopleOutline size={ 14 } />
              <span>Registro de visitas</span>
            </div>
          }
        >
          <CustomTable
            data={ getFilteredVisitors( "all" ) }
            columns={ columns }
            statusColorMap={ statusColorMap }
            initialVisibleColumns={ [
              "profilePicture",
              "fullName",
              "date",
              "dateAndTimeOfVisit",
              "dni",
              "phone",
              "description",
              "vehiclePlate",
              "property",
              "visitCompleted",
              "actions",
            ] }
            addButtonComponent={ <VisitorForm /> }
            title="todas las visitas"
          />
        </UI.Tab>
      </UI.Tabs>

      <UI.Modal isOpen={ isOpen } onOpenChange={ onOpenChange } backdrop="blur" isDismissable={ false } scrollBehavior="normal" placement="top">
        <UI.ModalContent>
          { ( onClose ) => (
            <>
              <UI.ModalHeader className="flex justify-center flex-row space-x-2 items-center">
                <IconContainer children={ <Icons.IoPeopleOutline size={ 24 } /> } />
                <h2>Confirmar finalización de visita</h2>
              </UI.ModalHeader>
              <UI.ModalBody>
                <p className="text-2xl text-center">¿Estás seguro de que deseas finalizar esta visita?</p>
                <div className="mt-4 flex flex-col justify-center">
                  <h2 className="text-xl font-bold">{ visitorToComplete?.fullName }</h2>
                  <p>{ visitorToComplete?.description }</p>
                </div>
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center flex-row space-x-2 items-center">
                <UI.Button color="danger" variant="light" onPress={ onClose } isDisabled={ isCompletingVisit } startContent={ <Icons.IoArrowBackOutline size={ 24 } /> }>
                  Cancelar
                </UI.Button>
                <UI.Button color="primary" onPress={ handleConfirm } isLoading={ isCompletingVisit } startContent={ !isCompletingVisit && <Icons.IoCheckmarkOutline size={ 24 } /> }>
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
