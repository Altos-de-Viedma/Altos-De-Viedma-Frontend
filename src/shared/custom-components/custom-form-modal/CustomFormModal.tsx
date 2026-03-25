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
        classNames={{
          wrapper: 'z-50',
          backdrop: 'bg-black/50 backdrop-blur-md',
          base: 'glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-2xl',
          header: 'border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-900/50',
          body: 'py-6',
          footer: 'border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-900/50',
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
        <UI.ModalContent>
          {(onClose) => (
            <>
              <UI.ModalHeader className="flex items-center justify-center px-6 py-4">
                <motion.div
                  className="flex items-center space-x-3 font-bold text-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    <IconContainer className="p-2 bg-primary-500/10 rounded-xl text-primary-500">
                      {icon}
                    </IconContainer>
                  </motion.div>
                  <h2 className="text-gradient">{title}</h2>
                </motion.div>
              </UI.ModalHeader>

              <UI.ModalBody className="px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  {body}
                </motion.div>
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-3 px-6 py-4">
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UI.Button
                      color="danger"
                      variant="light"
                      onPress={onClose}
                      startContent={<Icons.IoCloseOutline size={20} />}
                      className="btn-hover-lift font-medium"
                      isDisabled={isLoading}
                    >
                      {cancelButtonText}
                    </UI.Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UI.Button
                      color={saveButtonColor}
                      variant="solid"
                      onPress={onConfirm}
                      startContent={
                        isLoading ? (
                          <UI.Spinner size="sm" color="white" />
                        ) : (
                          <Icons.IoSaveOutline size={20} />
                        )
                      }
                      className="btn-hover-lift font-medium shadow-medium hover:shadow-large transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
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