import { useState } from 'react';
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
  const [selectedTab, setSelectedTab] = useState("active");

  const columns = [
    { name: "Principal", uid: "isMain" },
    { name: "Dirección", uid: "address" },
    { name: "Descripción", uid: "description" },
    { name: "Propietario", uid: "property" },
    { name: "Teléfono", uid: "phone" },
    ...( user?.roles?.includes( 'admin' ) && !user?.roles?.includes( 'security' ) ? [ { name: "Opciones", uid: "actions" } ] : [] )
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if ( isLoading ) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if ( !properties ) return null;

  const transformProperty = (property: any) => ({
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
  });

  const getFilteredProperties = (filter: string) => {
    const sortedProperties = properties.sort((a, b) => new Date(b.date || b.id).getTime() - new Date(a.date || a.id).getTime());

    switch (filter) {
      case "active":
        return sortedProperties.filter(property => property.status).map(transformProperty);
      case "inactive":
        return sortedProperties.filter(property => !property.status).map(transformProperty);
      default:
        return sortedProperties.map(transformProperty);
    }
  };

  const displayProperties = selectedTab === 'active' ? getFilteredProperties("active") : getFilteredProperties("inactive");
  const addButtonComponent = user?.roles?.includes( 'admin' ) ? <PropertyForm /> : null;

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      <UI.Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        aria-label="Property tabs"
        size="lg"
        classNames={{
          tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-full sm:w-auto",
          cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
          tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
          tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
        }}
      >
        <UI.Tab key="active" title={
          <div className="flex items-center gap-2 sm:gap-3">
            <Icons.IoCheckmarkCircleOutline size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Pendientes</span>
            <span className="sm:hidden">Pend.</span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
              {getFilteredProperties("active").length}
            </span>
          </div>
        } />
        <UI.Tab key="inactive" title={
          <div className="flex items-center gap-2 sm:gap-3">
            <Icons.IoCloseCircleOutline size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Finalizadas</span>
            <span className="sm:hidden">Fin.</span>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
              {getFilteredProperties("inactive").length}
            </span>
          </div>
        } />
      </UI.Tabs>

      <div className="w-full">
        <CustomTable
          data={displayProperties}
          columns={columns}
          statusColorMap={statusColorMap}
          initialVisibleColumns={["isMain", "address", "description", "property", "phone", ...(user?.roles?.includes('admin') && !user?.roles?.includes('security') ? ["actions"] : [])]}
          addButtonComponent={addButtonComponent}
          title={selectedTab === 'active' ? "propiedades pendientes" : "propiedades finalizadas"}
          className="w-full"
        />
      </div>
    </div>
  );
};