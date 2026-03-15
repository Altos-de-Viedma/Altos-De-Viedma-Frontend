import React from "react";

import { CustomTable, Icons, StatusColorMap, UI, useWhatsApp, useDisclosure, IconContainer } from '../../../shared';
import { PackageForm } from './PackageForm';
import { usePackages, useMarkAsReceived } from '../hooks';
import { useAuthStore } from '../../auth';
import { formatDate } from '../helper';


export const PackageList = () => {

  const { packages, isLoading } = usePackages();
  const { generateWhatsAppLink } = useWhatsApp();
  const { markAsReceived, isPending: isMarkingAsReceived } = useMarkAsReceived();
  const [ selected, setSelected ] = React.useState<string | number>( "pending" );
  const { user } = useAuthStore( ( state ) => ( { user: state.user } ) );
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [ packageToMark, setPackageToMark ] = React.useState<any | null>( null );

  if ( !user ) return null;

  const columns = [
    { name: "Título", uid: "title", sortable: true },
    { name: "Estado", uid: "receivedStatus", sortable: true },
    { name: "Fecha de creación", uid: "date", sortable: true },
    { name: "Fecha estimada de recepción", uid: "arrivalDate", sortable: true },
    { name: "Descripción", uid: "description", sortable: true },
    { name: "Propietario", uid: "user", sortable: true },
    { name: "Propiedad", uid: "property", sortable: true },
    { name: "Teléfono", uid: "phone", sortable: true },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if ( isLoading ) {
    return <UI.Spinner />;
  }

  if ( !packages ) return null;


  const transformedPackages = packages.map( pkg => ( {
    ...pkg,
    date: formatDate( pkg.date ),
    arrivalDate: formatDate( pkg.arrivalDate ),
    user: `${ pkg.user.lastName }, ${ pkg.user.name }`,
    phone: generateWhatsAppLink( pkg.user.phone ),
    property: pkg.property.isMain ? `🏠 ${ pkg.property.address }` : pkg.property.address,
    receivedStatus: pkg.received
      ? <UI.Chip color="success" startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> } variant="flat">Recibido</UI.Chip>
      : <UI.Chip color="secondary" startContent={ <Icons.IoAlertCircleOutline size={ 18 } /> } variant="flat">No recibido</UI.Chip>,
    actions: ( user?.roles?.includes( 'security' ) || pkg.user.id === user.id ) ? (
      !pkg.received && (
        <UI.Button
          color="primary"
          variant="light"
          onPress={ () => {
            setPackageToMark( pkg );
            onOpen();
          } }
          startContent={ <Icons.IoCheckmarkOutline size={ 18 } /> }
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
    if ( packageToMark ) {
      markAsReceived( packageToMark.id );
      onClose();
      setPackageToMark( null );
    }
  };

  return (
    <div className="flex w-full flex-col">
      <UI.Tabs aria-label="Options" color="primary" variant="bordered" selectedKey={ selected } onSelectionChange={ setSelected }>
        <UI.Tab
          key="pending"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoAlertCircleOutline size={ 14 } />
              <span>Pendientes</span>
            </div>
          }
        >
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
          />
        </UI.Tab>
        <UI.Tab
          key="received"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoCheckmarkOutline size={ 14 } />
              <span>Recibidos</span>
            </div>
          }
        >
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
          />
        </UI.Tab>
        <UI.Tab
          key="all"
          title={
            <div className="flex items-center space-x-2">
              <Icons.IoCubeOutline size={ 14 } />
              <span>Todos los paquetes</span>
            </div>
          }
        >
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
          />
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
                <UI.Button color="primary" onPress={ handleConfirm } isLoading={ isMarkingAsReceived } startContent={ !isMarkingAsReceived && <Icons.IoCheckmarkOutline size={ 24 } /> }>
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
