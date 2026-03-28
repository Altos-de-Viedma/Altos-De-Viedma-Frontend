import { Alert, AlertProps, Button } from '@heroui/react';
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
    <div className="center-flex w-full responsive-container px-4 sm:px-6">
      <div className="flex flex-col w-full max-w-4xl">
        <Alert
          className={ `my-2 sm:my-3 w-full shadow-sm hover:shadow-md transition-shadow duration-200 ${className || ''}` }
          closeButton={ isClosable ? (
            <Button
              size="sm"
              variant="light"
              className="min-w-unit-8 h-unit-8 responsive-text-xs"
              {...closeButtonProps}
            />
          ) : undefined }
          color={ color }
          description={ description && (
            <div className="responsive-text-sm text-foreground/80 mt-1 leading-relaxed">
              {description}
            </div>
          )}
          endContent={ endContent }
          hideCloseButton={ !isClosable }
          icon={ icon }
          isIconOnly={ hideIconWrapper }
          radius={ radius }
          startContent={ startContent }
          title={ title && (
            <div className="responsive-text-base font-semibold text-foreground mb-1">
              {title}
            </div>
          )}
          variant={ variant }
          classNames={{
            base: [
              "border border-gray-200/50 dark:border-gray-700/50",
              "bg-white/95 dark:bg-gray-800/95",
              "backdrop-blur-sm",
              "rounded-lg sm:rounded-xl",
              "p-3 sm:p-4 lg:p-5"
            ].join(" "),
            mainWrapper: "gap-3 sm:gap-4",
            iconWrapper: "flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8",
            alertIcon: "w-4 h-4 sm:w-5 sm:h-5",
            description: "responsive-text-sm leading-relaxed",
            closeButton: "top-2 sm:top-3 right-2 sm:right-3"
          }}
          { ...props }
        >
          <div className="responsive-text-sm sm:responsive-text-base text-foreground leading-relaxed">
            { message }
          </div>
        </Alert>
      </div>
    </div>
  );
};