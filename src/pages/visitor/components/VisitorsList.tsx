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
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if ( !visitors || !user ) return null;

  const columns = [
    { name: "Foto", uid: "profilePicture" },
    { name: "Nombre completo", uid: "fullName" },
    { name: "Ingreso", uid: "date" },
    { name: "Fecha de salida estimada", uid: "dateAndTimeOfVisit" },
    { name: "D.N.I.", uid: "dni" },
    { name: "Teléfono", uid: "phone" },
    { name: "Descripción", uid: "description" },
    { name: "Patente", uid: "vehiclePlate" },
    { name: "Propiedad", uid: "property" },
    { name: "Estado", uid: "visitCompleted" },
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
            color="success"
            variant="solid"
            onPress={ () => {
              setVisitorToComplete( visitor );
              onOpen();
            } }
            startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> }
            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Finalizar visita
          </UI.Button>
        ) }
      </div>
    )
  } );

  const getFilteredVisitors = ( filter: string | number ) => {
    const sortedVisitors = visitors.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    switch ( filter ) {
      case "pending":
        return sortedVisitors.filter( visitor => !visitor.visitCompleted ).map( transformVisitor );
      case "completed":
        return sortedVisitors.filter( visitor => visitor.visitCompleted ).map( transformVisitor );
      case "all":
      default:
        return sortedVisitors.map( transformVisitor );
    }
  };

  const handleConfirm = () => {
    handleCompleteVisit();
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
              <span className="truncate">Visitantes</span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredVisitors("pending").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
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
              className="w-full"
            />
          </div>
        </UI.Tab>
        <UI.Tab
          key="completed"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoCheckmarkOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate hidden sm:inline">Visitas finalizadas</span>
              <span className="truncate sm:hidden">Finalizadas</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredVisitors("completed").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
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
              className="w-full"
            />
          </div>
        </UI.Tab>
        <UI.Tab
          key="all"
          title={
            <div className="flex items-center gap-2 sm:gap-3">
              <Icons.IoPeopleOutline size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate hidden sm:inline">Registro de visitas</span>
              <span className="truncate sm:hidden">Registro</span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold flex-shrink-0">
                {getFilteredVisitors("all").length}
              </span>
            </div>
          }
        >
          <div className="w-full">
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
                <UI.Button
                  color="success"
                  variant="solid"
                  onPress={ handleConfirm }
                  isLoading={ isCompletingVisit }
                  startContent={ !isCompletingVisit && <Icons.IoCheckmarkOutline size={ 24 } /> }
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
