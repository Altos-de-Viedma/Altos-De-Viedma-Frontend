import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI } from '../../../shared';
import { changePasswordInputs, changePasswordSchema } from '../validators';
import { useUserUpdate } from '../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const ChangePasswordModal = ( { isOpen, onClose, userId }: Props ) => {
  const { userUpdate, isPending } = useUserUpdate();

  const [ isVisible, setIsVisible ] = useState( false );
  const [ isConfirmVisible, setIsConfirmVisible ] = useState( false );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<changePasswordInputs>( {
    resolver: zodResolver( changePasswordSchema ),
  } );

  const toggleVisibility = () => setIsVisible( !isVisible );
  const toggleConfirmVisibility = () => setIsConfirmVisible( !isConfirmVisible );

  const onSubmit = async ( data: changePasswordInputs ) => {
    if ( !userId ) return;

    await userUpdate( { password: data.password } as any, userId );
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <UI.Modal
      isOpen={ isOpen }
      onClose={ handleClose }
      backdrop="blur"
      isDismissable={ false }
    >
      <UI.ModalContent>
        { ( onClose ) => (
          <form onSubmit={ handleSubmit( onSubmit ) }>
            <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
              <div className="flex items-center space-x-2 font-bold text-2xl">
                { <Icons.IoKeyOutline size={ 24 } className="text-gray-500" /> }
                <h2>Cambiar contraseña</h2>
              </div>
            </UI.ModalHeader>

            <UI.ModalBody>
              <UI.Input
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={ toggleVisibility }
                  >
                    { isVisible ? <Icons.IoEyeOutline size={ 20 } /> : <Icons.IoEyeOffOutline size={ 20 } /> }
                  </button>
                }
                label="Nueva contraseña"
                placeholder="Ingrese la nueva contraseña"
                variant="bordered"
                errorMessage={ errors.password?.message }
                isInvalid={ !!errors.password }
                type={ isVisible ? 'text' : 'password' }
                { ...register( 'password' ) }
              />

              <UI.Input
                endContent={
                  <button
                    aria-label="toggle confirm password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={ toggleConfirmVisibility }
                  >
                    { isConfirmVisible ? <Icons.IoEyeOutline size={ 20 } /> : <Icons.IoEyeOffOutline size={ 20 } /> }
                  </button>
                }
                label="Confirmar nueva contraseña"
                placeholder="Confirme la nueva contraseña"
                variant="bordered"
                errorMessage={ errors.confirmPassword?.message }
                isInvalid={ !!errors.confirmPassword }
                type={ isConfirmVisible ? 'text' : 'password' }
                { ...register( 'confirmPassword' ) }
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
  );
};
