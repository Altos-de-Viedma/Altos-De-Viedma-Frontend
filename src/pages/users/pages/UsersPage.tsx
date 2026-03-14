import { useState } from 'react';

import { CustomTable, GenericPage, Icons, StatusColorMap, UI } from '../../../shared';
import { RoleChips, UsersForm, UserActions } from '../components';
import { useUsers, useInactiveUsers } from '../hooks';

export const UsersPage = () => {
  const [ selectedTab, setSelectedTab ] = useState( 'active' );

  const { users, isLoading } = useUsers();
  const { inactiveUsers, isLoading: isLoadingInactive } = useInactiveUsers();

  const columnsDef = [
    { name: "Usuario", uid: "username", sortable: true },
    { name: "Nombre Completo", uid: "fullName", sortable: true },
    { name: "Teléfono", uid: "phone", sortable: true },
    { name: "Dirección", uid: "address", sortable: true },
    { name: "Roles", uid: "roles", sortable: false },
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

  const transformedUsers = displayUsers.map( user => ( {
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
    <UI.Spinner />
  ) : (
    <>
      <UI.Tabs
        selectedKey={ selectedTab }
        onSelectionChange={ ( key ) => setSelectedTab( key as string ) }
        aria-label="User tabs"
        classNames={ {
          tabList: "gap-2",
          cursor: "bg-primary-100",
          tab: "px-4 py-2",
        } }
      >
        <UI.Tab key="active" title={
          <div className="flex items-center gap-2">
            <Icons.IoCheckmarkCircleOutline />
            Activos ({ users?.length || 0 })
          </div>
        } />
        <UI.Tab key="inactive" title={
          <div className="flex items-center gap-2">
            <Icons.IoCloseCircleOutline />
            Bloqueados ({ inactiveUsers?.length || 0 })
          </div>
        } />
      </UI.Tabs>

      <CustomTable
        data={ transformedUsers }
        columns={ columnsDef }
        statusColorMap={ statusColorMap }
        initialVisibleColumns={ [ "username", "fullName", "phone", "address", "roles", "status", "actions" ] }
        addButtonComponent={ selectedTab === 'active' ? <UsersForm /> : null }
        title={ selectedTab === 'active' ? "Usuarios activos" : "Usuarios bloqueados" }
      />
    </>
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
