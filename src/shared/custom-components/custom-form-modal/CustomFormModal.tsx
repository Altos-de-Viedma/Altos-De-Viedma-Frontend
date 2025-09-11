import { ReactNode } from 'react';

import { IconContainer, Icons, UI, useDisclosure } from '../../../shared';



interface Props {
  id?: string;
  title: string;
  icon: ReactNode;
  body: ReactNode;
  triggerButton: ReactNode;
  onSave: () => void;
}

export const CustomFormModal = ( { icon, title, body, onSave, triggerButton }: Props ) => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onConfirm = () => {
    onSave();
    onClose();
  };

  return (
    <div>
      <UI.Button onPress={ onOpen }>
        { triggerButton }
      </UI.Button>

      <UI.Modal
        isOpen={ isOpen }
        onOpenChange={ onOpenChange }
        backdrop="blur"
        isDismissable={ false }
      >
        <UI.ModalContent>
          { ( onClose ) => (
            <>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                <div className="flex items-center space-x-2 font-bold text-2xl">
                  <IconContainer children={ icon } className="text-gray-500" />
                  <h2>{ title }</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                { body }
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">

                <UI.Button
                  color="danger"
                  variant="light"
                  onPress={ onClose }
                  startContent={ <Icons.IoCloseOutline size={ 24 } /> }
                >
                  Cerrar
                </UI.Button>

                <UI.Button
                  color="primary"
                  onPress={ onConfirm }
                  startContent={ <Icons.IoSaveOutline size={ 24 } /> }
                >
                  Guardar
                </UI.Button>

              </UI.ModalFooter>
            </>
          ) }
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};