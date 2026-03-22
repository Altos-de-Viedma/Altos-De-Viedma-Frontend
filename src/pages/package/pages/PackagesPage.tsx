import { GenericPage, Icons } from '../../../shared';
import { PackageList } from '../components';



export const PackagesPage = () => {

  return (
    <GenericPage
      backUrl="/home"
      icon={ <Icons.IoCubeOutline size={ 26 } /> }
      title="Paquetes"
      bodyContent={ <PackageList /> }
    />
  );
};
