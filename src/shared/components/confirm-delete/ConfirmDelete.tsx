import React from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icons, UI } from '../ui';


interface Props {
  id: string;
  title: string;
  description: string;
  successMessage: string;
  errorMessage: string;
  onDelete: () => Promise<void>;
}

export const ConfirmDelete: React.FC<Props> = ( {
  title,
  description,
  successMessage,
  errorMessage,
  onDelete,
}: Props ) => {

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const { isOpen, onOpen, onClose } = useDisclosure();

  const confirmDeletion = () => {
    try {
      onDelete();
      onClose();
      toast.success( successMessage );
    } catch ( error: unknown ) {
      console.error( `Error al eliminar ${ title }:`, error );
      toast.error( errorMessage );
    }
  };

  const handleOpenModal = () => {
    onOpen();
  };

  return (
    <>
      <div onClick={ handleOpenModal }>
        <Icons.DeleteDocumentIcon size={ 24 } className={ UI.cn( iconClasses, "text-danger" ) } />
      </div>

      <Modal isOpen={ isOpen } onClose={ onClose }>
        <ModalContent>

          <ModalHeader className="text-center text-lg font-bold">{ title }</ModalHeader>

          <ModalBody className="text-center mt-2 text-xl">{ description }</ModalBody>

          <ModalFooter className="flex justify-center mt-4">
            <Button color="default" variant="light" onClick={ onClose } className="mr-2">
              Cancelar
            </Button>
            <Button color="danger" onClick={ confirmDeletion }>
              Sí, borrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
