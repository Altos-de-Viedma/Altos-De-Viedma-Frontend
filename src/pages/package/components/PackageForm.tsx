import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { PackageInputs, packageSchema } from '../validators';
import { useAddPackage, usePackage, usePackageUpdate } from '../hooks';
import { useInputIcon } from '../../../shared';
import { useProperties } from '../../property';



interface Props {
  id?: string;
}

export const PackageForm = ( { id }: Props ) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addPackage, isPending: isAddingPackage } = useAddPackage();
  const { packageUpdate, isPending: isUpdatingPackage } = usePackageUpdate();
  const { properties } = useProperties();

  const { pkg, isLoading } = id ? usePackage( id ) : { pkg: null, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<PackageInputs>( {
    resolver: zodResolver( packageSchema ),
  } );

  useEffect( () => {
    if ( id && pkg ) {
      reset( {
        title: pkg.title,
        propertyId: pkg.property.id,
        description: pkg.description,
        arrivalDate: pkg.arrivalDate,
      } );
    }
  }, [ id, pkg, reset ] );

  const onSubmit = async ( data: PackageInputs ) => {
    if ( id ) {
      await packageUpdate( data, id );
    } else {
      await addPackage( data );
      reset();
    }
    onClose();
  };

  const isPending = isAddingPackage || isUpdatingPackage;

  if ( id && isLoading ) {
    return <UI.Spinner />;
  }

  return (
    <div>
      <UI.Button startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> } onPress={ onOpen } variant="light">
        { id ? <><Icons.IoPencilOutline size={ 24 } /> Editar</> : 'Nuevo' }
      </UI.Button>

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        backdrop="blur"
        isDismissable={ false }
      >
        <UI.ModalContent>
          { ( onClose ) => (
            <form onSubmit={ handleSubmit( onSubmit ) }>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                <div className="flex items-center space-x-2 font-bold text-2xl">
                  { useInputIcon( { icon: 'IoCubeOutline', className: 'text-gray-500' } ) }
                  <h2>{ id ? 'Editar paquete' : 'Nuevo paquete' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoCubeOutline' } ) }
                  label="Título"
                  placeholder="Ingrese el título del paquete"
                  variant="bordered"
                  errorMessage={ errors.title?.message }
                  isInvalid={ !!errors.title }
                  { ...register( 'title' ) }
                />

                <UI.SelectConBuscador
                  label="Propiedad"
                  placeholder="Buscar propiedad..."
                  selectedKeys={ watch( 'propertyId' ) ? [ watch( 'propertyId' ) ] : [] }
                  onSelectionChange={ ( keys ) => {
                    const value = Array.from( keys )[ 0 ];
                    setValue( 'propertyId', value as string );
                  } }
                  variant="bordered"
                  errorMessage={ errors.propertyId?.message }
                  isInvalid={ !!errors.propertyId }
                  options={ properties?.map( ( property ) => ( {
                    key: property.id,
                    label: property.isMain ? `🏠 ${ property.address }` : property.address,
                    description: `${ property.user.lastName }, ${ property.user.name }${ property.isMain ? ' • Principal' : '' }`
                  } ) ) || [] }
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una breve descripción del paquete"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />

                <UI.Input
                  type="datetime-local"
                  label="Fecha estimada de recepción"
                  placeholder="Ingrese la fecha estimada de recepción"
                  variant="bordered"
                  errorMessage={ errors.arrivalDate?.message }
                  isInvalid={ !!errors.arrivalDate }
                  { ...register( 'arrivalDate' ) }
                />
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">
                <UI.Button
                  color="danger"
                  variant="light"
                  onPress={ onClose }
                  isDisabled={ isPending }
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  type="submit"
                  isLoading={ isPending }
                  startContent={ !isPending && <Icons.IoSaveOutline size={ 24 } /> }
                >
                  Guardar
                </UI.Button>
              </UI.ModalFooter>
            </form>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};
