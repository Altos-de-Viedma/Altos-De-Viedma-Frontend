import { GenericPage, Icons, UI } from '../../../shared';
import { NotificationCard } from '../components/NotificationCard';


export const NotificationsPage = () => {

  const notificationsContent = (
    <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
      <NotificationCard
        color="success"
        message="This is a success message"
        title="Success"
        variant="faded"
        isClosable={ true }
        closeButtonProps={ { 'aria-label': 'Close Alert' } }
      />
      <NotificationCard
        color="warning"
        message="This is a warning message"
        description="Please take action immediately"
        endContent={
          <UI.Button
            size="sm"
            className="responsive-text-xs sm:responsive-text-sm min-h-[2.5rem] sm:min-h-[3rem] px-3 sm:px-4"
          >
            Take Action
          </UI.Button>
        }
      />
      <NotificationCard
        color="danger"
        message="Error occurred"
        hideIcon={ true }
        radius="full"
      />
    </div>
  );

  return (
    <GenericPage
      backUrl="/home"
      icon={ <Icons.IoNotificationsOutline /> }
      title="Notificaciones"
      bodyContent={ notificationsContent }
    />
  );
};