import { motion, AnimatePresence } from 'framer-motion';
import { UI } from '../../components/ui';
import { CustomModalProps } from './interfaces';

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

export const CustomModal = ({
  isOpen,
  onOpenChange,
  headerContent,
  bodyContent,
  footerContent,
  size = 'md',
  backdrop = 'blur',
  isDismissable = true,
  hideCloseButton = false,
  className = '',
}: CustomModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <UI.Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="center"
          size={size}
          backdrop={backdrop}
          isDismissable={isDismissable}
          hideCloseButton={hideCloseButton}
          classNames={{
            wrapper: 'z-50',
            backdrop: 'bg-black/50 backdrop-blur-md',
            base: 'glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-2xl',
            header: 'border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50',
            body: 'py-6',
            footer: 'border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50',
            closeButton: 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
          }}
          motionProps={{
            variants: modalVariants,
            initial: 'hidden',
            animate: 'visible',
            exit: 'exit',
          }}
        >
          <UI.ModalContent className={className}>
            {() => (
              <>
                {headerContent && (
                  <UI.ModalHeader className="flex flex-col gap-1 px-6 py-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      {headerContent}
                    </motion.div>
                  </UI.ModalHeader>
                )}

                <UI.ModalBody className="px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {bodyContent}
                  </motion.div>
                </UI.ModalBody>

                {footerContent && (
                  <UI.ModalFooter className="px-6 py-4">
                    <motion.div
                      className="flex gap-2 w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      {footerContent}
                    </motion.div>
                  </UI.ModalFooter>
                )}
              </>
            )}
          </UI.ModalContent>
        </UI.Modal>
      )}
    </AnimatePresence>
  );
};