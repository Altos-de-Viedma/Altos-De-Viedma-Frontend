import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { PropertyInputs, propertySchema } from '../validators';
import { useAddProperty, useProperty, usePropertyUpdate } from '../hooks';
import { useInputIcon } from '../../../shared';
import { useUsers } from '../../users';

interface Props {
  id?: string;
}

export const PropertyForm = ( { id }: Props ) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addProperty } = useAddProperty();
  const { propertyUpdate } = usePropertyUpdate();
  const { users } = useUsers();

  const { property, isLoading } = id ? useProperty( id ) : { property: null, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<PropertyInputs>( {
    resolver: zodResolver( propertySchema ),
  } );

  useEffect( () => {
    if ( id && property ) {
      reset( {
        address: property.address,
        description: property.description,
        user: property.user.id,
      } );
      setValue( 'user', property.user.id );
    }
  }, [ id, property, reset, setValue ] );

  const onSubmit = async ( data: PropertyInputs ) => {
    if ( id ) {
      await propertyUpdate( data, id );
    } else {
      await addProperty( data );
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
        { id ? <><Icons.IoPencilOutline size={ 24 } /> Editar</> : 'Nueva' }
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
                  { useInputIcon( { icon: 'IoHomeOutline', className: 'text-gray-500' } ) }
                  <h2>{ id ? 'Editar propiedad' : 'Nueva propiedad' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoLocationOutline' } ) }
                  label="Dirección"
                  placeholder="Ingrese la dirección de la propiedad"
                  variant="bordered"
                  errorMessage={ errors.address?.message }
                  isInvalid={ !!errors.address }
                  { ...register( 'address' ) }
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una breve descripción de la propiedad"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />

                <UI.Select
                  label="Propietario"
                  placeholder="Seleccione el propietario"
                  variant="bordered"
                  errorMessage={ errors.user?.message }
                  isInvalid={ !!errors.user }
                  { ...register( 'user' ) }
                >
                  { users?.map( ( user ) => (
                    <UI.SelectItem key={ user.id } value={ user.id }>
                      { `${ user.lastName }, ${ user.name }` }
                    </UI.SelectItem>
                  ) ) || [] }
                </UI.Select>
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
