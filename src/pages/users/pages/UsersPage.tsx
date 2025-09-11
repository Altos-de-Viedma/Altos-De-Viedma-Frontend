import { CustomTable, GenericPage, Icons, StatusColorMap, UI } from '../../../shared';
import { RoleChips, UsersForm } from '../components';
import { useUsers } from '../hooks';

export const UsersPage = () => {

  const { users, isLoading } = useUsers();

  const columnsDef = [
    { name: "Usuario", uid: "username", sortable: true },
    { name: "Nombre Completo", uid: "fullName", sortable: true },
    { name: "Teléfono", uid: "phone", sortable: true },
    { name: "Dirección", uid: "address", sortable: true },
    { name: "Roles", uid: "roles", sortable: false },
    { name: "Opciones", uid: "actions" }
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if ( !users ) return null;

  const transformedUsers = users.map( user => ( {
    ...user,
    username: user.username,
    fullName: user.lastName + ', ' + user.name,
    phone: user.phone,
    address: user.address,
    roles: <RoleChips roles={ user.roles } />,
    actions: <UsersForm id={ user.id } />
  } ) );

  const userPageContent = isLoading ? (
    <UI.Spinner />
  ) : (
    <CustomTable
      data={ transformedUsers }
      columns={ columnsDef }
      statusColorMap={ statusColorMap }
      initialVisibleColumns={ [ "username", "fullName", "phone", "address", "roles", "actions" ] }
      addButtonComponent={ <UsersForm /> }
      title="usuarios"
    />
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
