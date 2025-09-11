export interface CustomModalProps {

  isOpen:             boolean;

  bodyContent:        React.ReactNode;
  footerContent:      React.ReactNode;
  headerContent:      React.ReactNode;

  onClose:            () => void;
  onConfirm:          () => void;
  onOpenChange:       (open: boolean) => void;
}
