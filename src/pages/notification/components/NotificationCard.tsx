import { Alert, AlertProps, Button } from '@nextui-org/react';
import { FC, ReactNode } from 'react';

interface NotificationCardProps extends Omit<AlertProps, 'children'> {
  closeButtonProps?: AlertProps[ 'closeButtonProps' ];
  description?: ReactNode;
  endContent?: ReactNode;
  hideIcon?: boolean;
  hideIconWrapper?: boolean;
  icon?: ReactNode;
  isClosable?: boolean;
  isVisible?: boolean;
  message: ReactNode;
  startContent?: ReactNode;
  title?: ReactNode;
}

export const NotificationCard: FC<NotificationCardProps> = ( {
  className,
  closeButtonProps,
  color = 'default',
  description,
  endContent,
  hideIcon = false,
  hideIconWrapper = false,
  icon,
  isClosable = false,
  isVisible,
  message,
  radius = 'md',
  startContent,
  title,
  variant = 'flat',
  ...props
} ) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col w-full">
        <Alert
          className={ `my-3 ${ className || '' }` }
          closeButton={ isClosable ? <Button { ...closeButtonProps } /> : undefined }
          color={ color }
          description={ description }
          endContent={ endContent }
          hideCloseButton={ !isClosable }
          icon={ icon }
          isIconOnly={ hideIconWrapper }
          radius={ radius }
          startContent={ startContent }
          title={ title }
          variant={ variant }
          { ...props }
        >
          { message }
        </Alert>
      </div>
    </div>
  );
};