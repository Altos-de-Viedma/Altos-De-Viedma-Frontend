import { useState } from 'react';

import { CustomTable, GenericPage, Icons, StatusColorMap, UI } from '../../../shared';
import { RoleChips, UsersForm, UserActions } from '../components';
import { useUsers, useInactiveUsers } from '../hooks';
import { useAllProperties } from '../../property/hooks';

export const UsersPage = () => {
  const [ selectedTab, setSelectedTab ] = useState( 'active' );

  const { users, isLoading } = useUsers();
  const { inactiveUsers, isLoading: isLoadingInactive } = useInactiveUsers();
  const { properties, isLoading: isLoadingProperties } = useAllProperties();

  const columnsDef = [
    { name: "Usuario", uid: "username" },
    { name: "Nombre Completo", uid: "fullName" },
    { name: "Teléfono", uid: "phone" },
    { name: "Propiedades", uid: "address" },
    { name: "Roles", uid: "roles" },
    { name: "Estado", uid: "status" },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  // Function to get user properties
  const getUserProperties = (userId: string) => {
    if (!properties) return [];
    return properties.filter(property =>
      property.users?.some(user => user.id === userId)
    );
  };

  // Filter users based on selected tab
  const getDisplayUsers = () => {
    switch (selectedTab) {
      case 'active':
        // Active users with properties
        return users?.filter(user => getUserProperties(user.id).length > 0) || [];
      case 'no_properties':
        // Active users without properties
        return users?.filter(user => getUserProperties(user.id).length === 0) || [];
      case 'inactive':
        // All inactive users
        return inactiveUsers || [];
      default:
        return [];
    }
  };

  const displayUsers = getDisplayUsers();
  const isLoadingTab = selectedTab === 'active' ? isLoading :
                      selectedTab === 'no_properties' ? isLoading :
                      isLoadingInactive;

  if ( !users || !inactiveUsers || isLoadingProperties ) return null;

  const transformedUsers = displayUsers
    .sort((a, b) => new Date(b.creationDate || b.id).getTime() - new Date(a.creationDate || a.id).getTime())
    .map( user => {
      const userProperties = getUserProperties(user.id);
      const propertiesDisplay = userProperties.length > 0
        ? userProperties.map(prop => prop.isMain ? `🏠 ${prop.address}` : prop.address).join(', ')
        : 'Sin propiedades asignadas';

      return {
        ...user,
        username: user.username,
        fullName: user.lastName + ', ' + user.name,
        phone: user.phone,
        address: propertiesDisplay,
        roles: <RoleChips roles={ user.roles } />,
        status: user.isActive ? (
          <UI.Badge color="success" variant="flat">Activo</UI.Badge>
        ) : (
          <UI.Badge color="danger" variant="flat">Bloqueado</UI.Badge>
        ),
        actions: (
          <div className="flex gap-2">
            <UsersForm id={ user.id } />
            <UserActions id={ user.id } isActive={ user.isActive } />
          </div>
        )
      };
    } );

  const userPageContent = (isLoadingTab || isLoadingProperties) ? (
    <div className="center-flex py-12">
      <UI.Spinner size="lg" color="primary" />
    </div>
  ) : (
    <div className="w-full space-y-6 lg:space-y-8">
      <UI.Tabs
        selectedKey={ selectedTab }
        onSelectionChange={ ( key ) => setSelectedTab( key as string ) }
        aria-label="User tabs"
        size="lg"
        classNames={ {
          tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-full sm:w-auto",
          cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
          tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
          tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
        } }
      >
        <UI.Tab key="active" title={
          <div className="flex items-center gap-2 sm:gap-3">
            <Icons.IoCheckmarkCircleOutline size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Activos</span>
            <span className="sm:hidden">Act.</span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
              { users?.filter(user => getUserProperties(user.id).length > 0).length || 0 }
            </span>
          </div>
        } />
        <UI.Tab key="no_properties" title={
          <div className="flex items-center gap-2 sm:gap-3">
            <Icons.IoAlertCircleOutline size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Sin Propiedades</span>
            <span className="sm:hidden">S/P</span>
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
              { users?.filter(user => getUserProperties(user.id).length === 0).length || 0 }
            </span>
          </div>
        } />
        <UI.Tab key="inactive" title={
          <div className="flex items-center gap-2 sm:gap-3">
            <Icons.IoCloseCircleOutline size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Eliminados</span>
            <span className="sm:hidden">Elim.</span>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
              { inactiveUsers?.length || 0 }
            </span>
          </div>
        } />
      </UI.Tabs>

      <div className="w-full">
        <CustomTable
          data={ transformedUsers }
          columns={ columnsDef }
          statusColorMap={ statusColorMap }
          initialVisibleColumns={ [ "username", "fullName", "phone", "address", "roles", "status", "actions" ] }
          addButtonComponent={ selectedTab === 'active' || selectedTab === 'no_properties' ? <UsersForm /> : null }
          title={
            selectedTab === 'active' ? "Usuarios activos con propiedades" :
            selectedTab === 'no_properties' ? "Usuarios sin propiedades asignadas" :
            "Usuarios eliminados"
          }
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <GenericPage
      backUrl="/home"
      icon={ <Icons.IoIdCardOutline /> }
      title="Usuarios"
      bodyContent={ userPageContent }
    />
  );
};
