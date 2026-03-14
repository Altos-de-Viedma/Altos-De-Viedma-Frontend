import { UI, useDisclosure } from '../../../shared';
import { Icons } from '../../../shared';
import { useUserDelete, useUserActivate } from '../hooks';
import { useAuthStore } from '../../auth';

interface Props {
  id: string;
  isActive?: boolean;
}

export const UserActions = ( { id, isActive = true }: Props ) => {
  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isOpen: isOpenActivate, onOpen: onOpenActivate, onOpenChange: onOpenChangeActivate, onClose: onCloseActivate } = useDisclosure();
  const { deleteUser, isPending: isDeleting } = useUserDelete();
  const { activate, isPending: isActivating } = useUserActivate();

  const isAdmin = user?.roles?.includes( 'admin' );

  const handleDelete = () => {
    deleteUser( id, () => {
      onClose();
    } );
  };

  const handleActivate = () => {
    activate( id, () => {
      onCloseActivate();
    } );
  };

  if ( !isAdmin ) return null;

  if ( isActive ) {
    return (
      <>
        <UI.Button
          size="sm"
          color="danger"
          variant="flat"
          startContent={ <Icons.IoTrashOutline size={ 16 } /> }
          onPress={ onOpen }
        >
          Bloquear
        </UI.Button>

        <UI.Modal isOpen={ isOpen } onClose={ onClose } onOpenChange={ onOpenChange }>
          <UI.ModalContent>
            <UI.ModalHeader className="flex flex-col">
              <span className="text-lg font-bold">Bloquear usuario</span>
            </UI.ModalHeader>
            <UI.ModalBody>
              <p>¿Estás seguro de que deseas bloquear este usuario?</p>
            </UI.ModalBody>
            <UI.ModalFooter className="flex justify-center space-x-2">
              <UI.Button color="default" variant="light" onPress={ onClose } isDisabled={ isDeleting } startContent={ <Icons.IoCloseOutline size={ 20 } /> }>
                Cancelar
              </UI.Button>
              <UI.Button color="danger" onPress={ handleDelete } isLoading={ isDeleting } startContent={ !isDeleting && <Icons.IoCheckmarkOutline size={ 20 } /> }>
                Sí, bloquear
              </UI.Button>
            </UI.ModalFooter>
          </UI.ModalContent>
        </UI.Modal>
      </>
    );
  }

  return (
    <>
      <UI.Button
        size="sm"
        color="success"
        variant="flat"
        startContent={ <Icons.IoCheckmarkOutline size={ 16 } /> }
        onPress={ onOpenActivate }
      >
        Activar
      </UI.Button>

      <UI.Modal isOpen={ isOpenActivate } onClose={ onCloseActivate } onOpenChange={ onOpenChangeActivate }>
        <UI.ModalContent>
          <UI.ModalHeader className="flex flex-col">
            <span className="text-lg font-bold">Activar usuario</span>
          </UI.ModalHeader>
          <UI.ModalBody>
            <p>¿Estás seguro de que deseas activar este usuario?</p>
          </UI.ModalBody>
          <UI.ModalFooter className="flex justify-center space-x-2">
            <UI.Button color="default" variant="light" onPress={ onCloseActivate } isDisabled={ isActivating } startContent={ <Icons.IoCloseOutline size={ 20 } /> }>
              Cancelar
            </UI.Button>
            <UI.Button color="success" onPress={ handleActivate } isLoading={ isActivating } startContent={ !isActivating && <Icons.IoCheckmarkOutline size={ 20 } /> }>
              Sí, activar
            </UI.Button>
          </UI.ModalFooter>
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};
