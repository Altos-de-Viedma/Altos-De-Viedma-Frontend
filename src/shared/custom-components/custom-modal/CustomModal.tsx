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
              '',
              'px-4 sm:px-6 py-3 sm:py-4'
            ].join(' '),
            body: [
              'py-4 sm:py-6 px-4 sm:px-6',
              'max-h-[60vh] sm:max-h-[70vh] overflow-y-auto',
              'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
              'scrollbar-track-gray-100 dark:scrollbar-track-gray-800'
            ].join(' '),
            footer: [
              'border-t border-gray-200/50 dark:border-gray-700/50',
              '',
              'px-4 sm:px-6 py-3 sm:py-4'
            ].join(' '),
            closeButton: [
              'hover:border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800',
              'transition-colors duration-200',
              'top-3 sm:top-4 right-3 sm:right-4',
              'w-8 h-8 sm:w-10 sm:h-10'
            ].join(' '),
          }}
          motionProps={{
            variants: modalVariants,
            initial: 'hidden',
            animate: 'visible',
            exit: 'exit',
          }}
        >
          <UI.ModalContent className={`${className} responsive-container`}>
            {() => (
              <>
                {headerContent && (
                  <UI.ModalHeader className="flex flex-col gap-1">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="w-full"
                    >
                      {headerContent}
                    </motion.div>
                  </UI.ModalHeader>
                )}

                <UI.ModalBody>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="w-full center-flex-col gap-4 sm:gap-6"
                  >
                    {bodyContent}
                  </motion.div>
                </UI.ModalBody>

                {footerContent && (
                  <UI.ModalFooter>
                    <motion.div
                      className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full justify-end"
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