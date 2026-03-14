import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { userInputs, updateInputs, createUserSchema, updateUserSchema } from '../validators';
import { useStringToArray, useInputIcon } from '../../../shared';
import { useUser, useUserAdd, useUserUpdate } from '../hooks';
import { ChangePasswordModal } from './ChangePasswordModal';



interface Props {
  id?: string;
}

export const UsersForm = ( { id }: Props ) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addNewUser, isPending: isAdding } = useUserAdd();
  const { userUpdate, isPending: isUpdating } = useUserUpdate();

  const { user, isLoading } = id ? useUser( id ) : { user: null, isLoading: false };

  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset
  } = useForm<userInputs | updateInputs>( {
    resolver: zodResolver( isEditing ? updateUserSchema : createUserSchema ),
  } );

  const [ isVisible, setIsVisible ] = useState( false );
  const [ isConfirmVisible, setIsConfirmVisible ] = useState( false );
  const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState( false );

  const toggleVisibility = () => setIsVisible( !isVisible );
  const toggleConfirmVisibility = () => setIsConfirmVisible( !isConfirmVisible );

  useEffect( () => {
    if ( id && user ) {
      reset( {
        username: user.username,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        roles: user.roles,
      } );
    }
  }, [ id, user, reset ] );

  const onSubmit = async ( data: userInputs | updateInputs ) => {
    const { confirmPassword, password, ...rest } = data;

    if ( id ) {
      // Al editar, solo enviar password si se proporcionó
      const payload = password ? { ...rest, password } : rest;
      await userUpdate( payload as updateInputs, id );
      onClose();
    } else {
      if ( !password ) {
        setError( 'password', { type: 'manual', message: 'La contraseña es obligatoria para nuevos usuarios.' } );
        return;
      }
      const payload = { ...rest, password };
      await addNewUser( payload as userInputs );
      reset();
      onClose();
    }
  };

  const handleRolesChange = ( value: string ) => {
    const rolesArray = useStringToArray( value );
    setValue( 'roles', rolesArray );
  };

  const isPending = isAdding || isUpdating;

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
                  { useInputIcon( { icon: 'IoIdCardOutline', className: 'text-gray-500' } ) }
                  <h2>{ id ? 'Editar usuario' : 'Nuevo usuario' }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoIdCardOutline' } ) }
                  label="Nombre de usuario"
                  placeholder="Ingrese el nombre de usuario"
                  variant="bordered"
                  errorMessage={ errors.username?.message }
                  isInvalid={ !!errors.username }
                  defaultValue={ user?.username }
                  { ...register( 'username' ) }
                />

                { !isEditing && (
                  <>
                    <UI.Input
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={ toggleVisibility }
                        >
                          { isVisible ? useInputIcon( { icon: 'IoEyeOutline' } ) : useInputIcon( { icon: 'IoEyeOffOutline' } ) }
                        </button>
                      }
                      label="Contraseña"
                      placeholder="Ingrese la contraseña"
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
                          { isConfirmVisible ? useInputIcon( { icon: 'IoEyeOutline' } ) : useInputIcon( { icon: 'IoEyeOffOutline' } ) }
                        </button>
                      }
                      label="Confirmar Contraseña"
                      placeholder="Confirme la contraseña"
                      variant="bordered"
                      errorMessage={ errors.confirmPassword?.message }
                      isInvalid={ !!errors.confirmPassword }
                      type={ isConfirmVisible ? 'text' : 'password' }
                      { ...register( 'confirmPassword' ) }
                    />
                  </>
                ) }

                { isEditing && (
                  <div className="flex justify-center py-2">
                    <UI.Button
                      variant="light"
                      color="primary"
                      startContent={ <Icons.IoKeyOutline size={ 20 } /> }
                      onPress={ () => setIsPasswordModalOpen( true ) }
                    >
                      Cambiar contraseña
                    </UI.Button>
                  </div>
                ) }

                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoPersonOutline' } ) }
                  label="Nombre"
                  placeholder="Ingrese el nombre"
                  variant="bordered"
                  errorMessage={ errors.name?.message }
                  isInvalid={ !!errors.name }
                  defaultValue={ user?.name }
                  { ...register( 'name' ) }
                />

                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoPersonOutline' } ) }
                  label="Apellido"
                  placeholder="Ingrese el apellido"
                  variant="bordered"
                  errorMessage={ errors.lastName?.message }
                  isInvalid={ !!errors.lastName }
                  defaultValue={ user?.lastName }
                  { ...register( 'lastName' ) }
                />

                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoCallOutline' } ) }
                  label="Teléfono"
                  placeholder="Ingrese el número de teléfono"
                  variant="bordered"
                  errorMessage={ errors.phone?.message }
                  isInvalid={ !!errors.phone }
                  defaultValue={ user?.phone }
                  { ...register( 'phone' ) }
                />

                <UI.Input
                  endContent={ useInputIcon( { icon: 'IoLocationOutline' } ) }
                  label="Dirección"
                  placeholder="Ingrese la dirección principal"
                  variant="bordered"
                  errorMessage={ errors.address?.message }
                  isInvalid={ !!errors.address }
                  defaultValue={ user?.address }
                  { ...register( 'address' ) }
                />

                <UI.Select
                  label="Seleccione los roles del usuario"
                  selectionMode="multiple"
                  variant="bordered"
                  errorMessage={ errors.roles?.message }
                  isInvalid={ !!errors.roles }
                  onChange={ ( e ) => handleRolesChange( e.target.value ) }
                  defaultSelectedKeys={ user?.roles }
                >
                  <UI.SelectItem
                    key="admin"
                    startContent={ useInputIcon( { icon: 'IoLockOpenOutline', size: 16 } ) }
                  >
                    Administrador
                  </UI.SelectItem>
                  <UI.SelectItem
                    key="user"
                    startContent={ useInputIcon( { icon: 'IoHomeOutline', size: 16 } ) }
                  >
                    Propietario
                  </UI.SelectItem>
                  <UI.SelectItem
                    key="security"
                    startContent={ useInputIcon( { icon: 'IoShieldHalfOutline', size: 16 } ) }
                  >
                    Seguridad
                  </UI.SelectItem>
                </UI.Select>
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

      <ChangePasswordModal
        isOpen={ isPasswordModalOpen }
        onClose={ () => setIsPasswordModalOpen( false ) }
        userId={ id }
      />
    </div>
  );
};
