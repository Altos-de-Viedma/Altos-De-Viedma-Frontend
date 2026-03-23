import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { EmergencyInputs, emergencySchema } from '../validators';
import { useAddEmergency, useEmergencieUpdate } from '../hooks';

interface Props {
  id?: string;
}

export const EmergencyForm = ( { id }: Props ) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addEmergency, isPending: isAddingEmergency } = useAddEmergency();
  const { emergencyUpdate, isPending: isUpdatingEmergency } = useEmergencieUpdate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmergencyInputs>( {
    resolver: zodResolver( emergencySchema ),
  } );

  useEffect( () => {
    if ( id ) {
      // Aquí deberías cargar los datos de la emergencia si se está editando
      // Por ahora, lo dejaremos vacío
    }
  }, [ id ] );

  const onSubmit = async ( data: EmergencyInputs ) => {
    if ( id ) {
      await emergencyUpdate( data, id );
    } else {
      await addEmergency( data );
      reset();
    }
    onClose();
  };

  const isPending = isAddingEmergency || isUpdatingEmergency;

  return (
    <div>
      <UI.Button startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> } onPress={ onOpen } color="primary" variant="solid" className="bg-primary-600 hover:bg-primary-700 text-white font-medium">
        { id ? <><Icons.IoPencilOutline size={ 24 } /> Editar</> : 'Nueva Emergencia' }
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
                  <Icons.IoMegaphoneOutline size={ 24 } className="text-gray-500" />
                  <h2>{ id ? 'Editar emergencia' : 'Nueva emergencia' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Input
                  label="Título"
                  placeholder="Ingrese el título de la emergencia"
                  variant="bordered"
                  errorMessage={ errors.title?.message }
                  isInvalid={ !!errors.title }
                  { ...register( 'title' ) }
                />

                <UI.Textarea
                  label="Descripción"
                  placeholder="Ingrese una descripción de la emergencia"
                  variant="bordered"
                  errorMessage={ errors.description?.message }
                  isInvalid={ !!errors.description }
                  { ...register( 'description' ) }
                />
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={ onClose }
                  isDisabled={ isPending }
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  variant="solid"
                  type="submit"
                  isLoading={ isPending }
                  startContent={ !isPending && <Icons.IoSaveOutline size={ 24 } /> }
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
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