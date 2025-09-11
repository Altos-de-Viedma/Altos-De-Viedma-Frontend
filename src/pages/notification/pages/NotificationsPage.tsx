import { GenericPage, Icons, UI } from '../../../shared';
import { NotificationCard } from '../components/NotificationCard';


export const NotificationsPage = () => {

  const notificationsContent = (
    <>
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
        endContent={ <UI.Button>Take Action</UI.Button> }
      />
      <NotificationCard
        color="danger"
        message="Error occurred"
        hideIcon={ true }
        radius="full"
      />
    </>
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