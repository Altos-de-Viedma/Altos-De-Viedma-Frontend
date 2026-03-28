import { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { IconContainer, Icons, UI, useDisclosure } from '../../../shared';

interface Props {
  id?: string;
  title: string;
  icon: ReactNode;
  body: ReactNode;
  triggerButton: ReactNode;
  onSave: () => void;
  isLoading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  saveButtonText?: string;
  cancelButtonText?: string;
  saveButtonColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  isDismissable?: boolean;
}

export const CustomFormModal = ({
  icon,
  title,
  body,
  onSave,
  triggerButton,
  isLoading = false,
  size = 'md',
  saveButtonText = 'Guardar',
  cancelButtonText = 'Cerrar',
  saveButtonColor = 'primary',
  isDismissable = false
}: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onConfirm = () => {
    onSave();
    onClose();
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <UI.Button onPress={onOpen} className="btn-hover-lift">
          {triggerButton}
        </UI.Button>
      </motion.div>

      <UI.Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={isDismissable}
        size={size}
        placement="center"
        scrollBehavior="inside"
        classNames={{
          wrapper: 'z-50 p-4 sm:p-6 center-flex',
          backdrop: 'bg-black/50 backdrop-blur-md',
          base: [
            'glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-2xl',
            'mx-4 sm:mx-6 max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)]',
            'max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)]',
            'rounded-lg sm:rounded-xl'
          ].join(' '),
          header: [
            'border-b border-gray-200/50 dark:border-gray-700/50',
            'bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-900/50',
            'px-4 sm:px-6 py-4 sm:py-5'
          ].join(' '),
          body: [
            'py-4 sm:py-6 px-4 sm:px-6',
            'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto',
            'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
            'scrollbar-track-gray-100 dark:scrollbar-track-gray-800'
          ].join(' '),
          footer: [
            'border-t border-gray-200/50 dark:border-gray-700/50',
            'bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-900/50',
            'px-4 sm:px-6 py-4 sm:py-5'
          ].join(' '),
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              scale: 0.95,
              transition: {
                duration: 0.3,
                ease: 'easeInOut',
              },
            },
          },
        }}
      >
        <UI.ModalContent className="responsive-container">
          {(onClose) => (
            <>
              <UI.ModalHeader className="flex items-center justify-center">
                <motion.div
                  className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="flex-shrink-0"
                  >
                    <IconContainer className="p-2 sm:p-3 bg-primary-500/10 rounded-xl text-primary-500">
                      {icon}
                    </IconContainer>
                  </motion.div>
                  <h2 className="text-gradient responsive-text-lg sm:responsive-text-xl font-bold">{title}</h2>
                </motion.div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="w-full center-flex-col gap-4 sm:gap-6"
                >
                  {body}
                </motion.div>
              </UI.ModalBody>

              <UI.ModalFooter className="center-flex">
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <UI.Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      startContent={<Icons.IoCloseOutline size={18} />}
                      className="btn-hover-lift font-medium w-full sm:w-auto min-h-[3rem] sm:min-h-[2.5rem] responsive-text-sm"
                      isDisabled={isLoading}
                    >
                      {cancelButtonText}
                    </UI.Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <UI.Button
                      color={saveButtonColor}
                      variant="solid"
                      onPress={onConfirm}
                      startContent={
                        isLoading ? (
                          <UI.Spinner size="sm" color="white" />
                        ) : (
                          <Icons.IoSaveOutline size={18} />
                        )
                      }
                      className="btn-hover-lift font-medium shadow-medium hover:shadow-large transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto min-h-[3rem] sm:min-h-[2.5rem] responsive-text-sm"
                      isLoading={isLoading}
                      isDisabled={isLoading}
                    >
                      {saveButtonText}
                    </UI.Button>
                  </motion.div>
                </motion.div>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};