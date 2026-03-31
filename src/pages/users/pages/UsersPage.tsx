import { useState } from 'react';

import { CustomTable, GenericPage, Icons, StatusColorMap, UI } from '../../../shared';
import { RoleChips, UsersForm, UserActions } from '../components';
import { useUsers, useInactiveUsers } from '../hooks';

export const UsersPage = () => {
  const [ selectedTab, setSelectedTab ] = useState( 'active' );

  const { users, isLoading } = useUsers();
  const { inactiveUsers, isLoading: isLoadingInactive } = useInactiveUsers();

  const columnsDef = [
    { name: "Usuario", uid: "username" },
    { name: "Nombre Completo", uid: "fullName" },
    { name: "Teléfono", uid: "phone" },
    { name: "Dirección", uid: "address" },
    { name: "Roles", uid: "roles" },
    { name: "Estado", uid: "status" },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  const displayUsers = selectedTab === 'active' ? users : inactiveUsers;
  const isLoadingTab = selectedTab === 'active' ? isLoading : isLoadingInactive;

  if ( !displayUsers ) return null;

  const transformedUsers = displayUsers
    .sort((a, b) => new Date(b.creationDate || b.id).getTime() - new Date(a.creationDate || a.id).getTime())
    .map( user => ( {
    ...user,
    username: user.username,
    fullName: user.lastName + ', ' + user.name,
    phone: user.phone,
    address: user.address,
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
  } ) );

  const userPageContent = isLoadingTab ? (
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
            <span className="hidden sm:inline">Pendientes</span>
            <span className="sm:hidden">Pend.</span>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full responsive-text-xs font-semibold">
              { users?.length || 0 }
            </span>
          </div>
        } />
        <UI.Tab key="inactive" title={
          <div className="flex items-center gap-2 sm:gap-3">
            <Icons.IoCloseCircleOutline size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Finalizados</span>
            <span className="sm:hidden">Fin.</span>
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
          addButtonComponent={ selectedTab === 'active' ? <UsersForm /> : null }
          title={ selectedTab === 'active' ? "Usuarios activos" : "Usuarios bloqueados" }
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
