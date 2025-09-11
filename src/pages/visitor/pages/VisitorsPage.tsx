import { GenericPage, Icons } from '../../../shared';
import { VisitorsList } from '../components';


export const VisitorsPage = () => {


  return (
    <GenericPage
      backUrl="/home"
      icon={ <Icons.IoManOutline size={ 26 } /> }
      title="Visitantes"
      bodyContent={ <VisitorsList /> }
    />
  );
};
