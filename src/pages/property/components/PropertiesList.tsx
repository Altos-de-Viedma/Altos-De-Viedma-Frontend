import { CustomTable, StatusColorMap, UI, useWhatsApp } from '../../../shared';
import { useProperties } from '../hooks';
import { PropertyForm } from './PropertyForm';
import { useAuthStore } from '../../auth';

export const PropertiesList = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { properties, isLoading } = useProperties();
  const { generateWhatsAppLink } = useWhatsApp();

  const columns = [
    { name: "Dirección", uid: "address", sortable: true },
    { name: "Descripción", uid: "description", sortable: true },
    { name: "Propietario", uid: "property", sortable: true },
    { name: "Teléfono", uid: "phone", sortable: true },
    ...( user?.roles?.includes( 'admin' ) && !user?.roles?.includes( 'security' ) ? [ { name: "Opciones", uid: "actions" } ] : [] )
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if ( isLoading ) {
    return <UI.Spinner />;
  }

  if ( !properties ) return null;

  const transformedProperties = properties.map( property => ( {
    ...property,
    address: property.address,
    property: `${ property.user.lastName }, ${ property.user.name }`,
    phone: generateWhatsAppLink( property.user.phone ),
    description: property.description,
    ...( user?.roles?.includes( 'admin' ) && !user?.roles?.includes( 'security' ) && { actions: <PropertyForm id={ property.id } /> } )
  } ) );

  return (
    <CustomTable
      data={ transformedProperties }
      columns={ columns }
      statusColorMap={ statusColorMap }
      initialVisibleColumns={ [ "address", "description", "property", "phone", ...( user?.roles?.includes( 'admin' ) && !user?.roles?.includes( 'security' ) ? [ "actions" ] : [] ) ] }
      addButtonComponent={ user?.roles?.includes( 'admin' ) ? <PropertyForm /> : null }
      title="Propiedades"
    />
  );
};
