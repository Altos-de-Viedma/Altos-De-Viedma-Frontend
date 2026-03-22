import { GenericPage, Icons } from '../../../shared';
import { EmergencyList } from '../components/EmergencyList';

export const EmergenciesPage = () => {
  const emergenciesContentPage = (
    <EmergencyList />
  );

  return (
    <GenericPage
      backUrl="/home"
      icon={ <Icons.IoMegaphoneOutline size={ 26 } /> }
      title="Emergencias"
      bodyContent={ emergenciesContentPage }
    />
  );
};