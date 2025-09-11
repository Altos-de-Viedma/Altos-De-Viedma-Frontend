import { UI } from '../../components/ui';
import { CustomModalProps } from './interfaces';



export const CustomModal = ( {
  isOpen,
  onOpenChange,
  headerContent,
  bodyContent,
  footerContent
}: CustomModalProps ) => {

  return (
    <UI.Modal
      isOpen={ isOpen }
      onOpenChange={ onOpenChange }
      placement="center"
    >
      <UI.ModalContent>
        { () => (
          <>

            <UI.ModalHeader className="flex flex-col gap-1">
              { headerContent }
            </UI.ModalHeader>

            <UI.ModalBody>
              { bodyContent }
            </UI.ModalBody>

            <UI.ModalFooter>
              { footerContent }
            </UI.ModalFooter>

          </>
        ) }
      </UI.ModalContent>
    </UI.Modal>
  );
};