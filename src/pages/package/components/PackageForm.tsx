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
  const { addPackage } = useAddPackage();
  const { packageUpdate } = usePackageUpdate();
  const { properties } = useProperties();

  const { pkg, isLoading } = id ? usePackage( id ) : { pkg: null, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
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

                <UI.Select
                  label="Propiedad"
                  placeholder="Seleccione la propiedad"
                  variant="bordered"
                  errorMessage={ errors.propertyId?.message }
                  isInvalid={ !!errors.propertyId }
                  { ...register( 'propertyId' ) }
                >
                  { properties?.map( ( property ) => (
                    <UI.SelectItem
                      key={ property.id }
                      value={ property.id }
                      textValue={ `${ property.address } | ${ property.user.lastName }, ${ property.user.name }` }
                    >
                      { property.address } | { property.user.lastName }, { property.user.name }
                    </UI.SelectItem>
                  ) ) || [] }
                </UI.Select>

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
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  type="submit"
                  startContent={ <Icons.IoSaveOutline size={ 24 } /> }
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
