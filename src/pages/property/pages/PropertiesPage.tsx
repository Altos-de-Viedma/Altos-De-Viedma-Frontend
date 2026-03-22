import { GenericPage, Icons } from '../../../shared';
import { PropertiesList } from '../components';


export const PropertiesPage = () => {

  return (
    <GenericPage
      backUrl="/home"
      icon={ <Icons.IoHomeOutline /> }
      title="Propiedades"
      bodyContent={ <PropertiesList /> }
    />
  );
};
