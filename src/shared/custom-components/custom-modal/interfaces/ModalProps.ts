import { ReactNode } from 'react';

export interface CustomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;

  headerContent?: ReactNode;
  bodyContent: ReactNode;
  footerContent?: ReactNode;

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  backdrop?: 'transparent' | 'opaque' | 'blur';
  isDismissable?: boolean;
  hideCloseButton?: boolean;
  className?: string;

  onClose?: () => void;
  onConfirm?: () => void;
}
