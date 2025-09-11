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
  const { addEmergency } = useAddEmergency();
  const { emergencyUpdate } = useEmergencieUpdate();

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

  return (
    <div>
      <UI.Button startContent={ id ? '' : <Icons.IoAddOutline size={ 24 } /> } onPress={ onOpen } variant="light">
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