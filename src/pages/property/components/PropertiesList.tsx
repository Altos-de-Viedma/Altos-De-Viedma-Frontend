import { CustomTable, StatusColorMap, UI, useWhatsApp, UserModal } from '../../../shared';
import { useProperties, useSetMainProperty } from '../hooks';
import { PropertyForm } from './PropertyForm';
import { useAuthStore } from '../../auth';
import { Icons } from '../../../shared';

export const PropertiesList = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { properties, isLoading } = useProperties();
  const { generateWhatsAppLink } = useWhatsApp();
  const { setAsMain, isPending: isSettingMain } = useSetMainProperty();

  const columns = [
    { name: "Principal", uid: "isMain", sortable: true },
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
    isMain: property.isMain ? (
      <UI.Badge color="primary" variant="flat">
        🏠 Principal
      </UI.Badge>
    ) : (
      <UI.Button
        size="sm"
        variant="flat"
        color="primary"
        startContent={ !isSettingMain && <Icons.IoStarOutline size={ 16 } /> }
        isLoading={ isSettingMain }
        onPress={ () => setAsMain( property.id ) }
      >
        Establecer principal
      </UI.Button>
    ),
    address: property.isMain ? `🏠 ${ property.address }` : property.address,
    property: (
      <UserModal user={property.user}>
        {`${ property.user.lastName }, ${ property.user.name }`}
      </UserModal>
    ),
    phone: generateWhatsAppLink( property.user.phone ),
    description: property.description,
    ...( user?.roles?.includes( 'admin' ) && !user?.roles?.includes( 'security' ) && { actions: <PropertyForm id={ property.id } /> } )
  } ) );

  return (
    <CustomTable
      data={ transformedProperties }
      columns={ columns }
      statusColorMap={ statusColorMap }
      initialVisibleColumns={ [ "isMain", "address", "description", "property", "phone", ...( user?.roles?.includes( 'admin' ) && !user?.roles?.includes( 'security' ) ? [ "actions" ] : [] ) ] }
      addButtonComponent={ user?.roles?.includes( 'admin' ) ? <PropertyForm /> : null }
      title="Propiedades"
    />
  );
};
