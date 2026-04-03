import { useMemo } from 'react';
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

  // Filtrar propiedades según el rol del usuario
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    // Convertir estructura antigua a nueva (compatibilidad temporal)
    const normalizedProperties = properties.map(property => ({
      ...property,
      users: property.users || (property.user ? [property.user] : [])
    }));

    // Si es usuario normal, solo mostrar propiedades donde es propietario
    if (!user?.roles?.includes('admin') && !user?.roles?.includes('security')) {
      return normalizedProperties.filter(property =>
        property.users.some(owner => owner.id === user?.id)
      );
    }

    // Admin y security ven todas las propiedades
    return normalizedProperties;
  }, [properties, user]);

  const columns = [
    { name: "Principal", uid: "isMain" },
    { name: "Dirección", uid: "address" },
    { name: "Descripción", uid: "description" },
    { name: "Propietarios", uid: "owners" },
    { name: "Teléfonos", uid: "phones" },
    ...(user?.roles?.includes('admin') ? [{ name: "Opciones", uid: "actions" }] : [])
  ];

  const statusColorMap: StatusColorMap = {
    active: "success",
    inactive: "danger"
  };

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!properties) return null;

  const transformedProperties = filteredProperties
    .sort((a, b) => new Date(b.date || b.id).getTime() - new Date(a.date || a.id).getTime())
    .map(property => ({
      ...property,
      isMain: property.isMain ? (
        <UI.Badge color="primary" variant="flat">
          🏠 Principal
        </UI.Badge>
      ) : (
        user?.roles?.includes('admin') ? (
          <UI.Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={!isSettingMain && <Icons.IoStarOutline size={16} />}
            isLoading={isSettingMain}
            onPress={() => setAsMain(property.id)}
          >
            Establecer principal
          </UI.Button>
        ) : (
          <span className="text-gray-500 text-sm">-</span>
        )
      ),
      address: property.isMain ? `🏠 ${property.address}` : property.address,
      owners: (
        <div className="flex flex-wrap gap-1">
          {property.users.map((owner, index) => (
            <UserModal key={owner.id} user={owner}>
              <UI.Chip
                size="sm"
                color="primary"
                variant="flat"
                className="cursor-pointer hover:bg-primary-100"
              >
                {`${owner.lastName}, ${owner.name}`}
              </UI.Chip>
            </UserModal>
          ))}
        </div>
      ),
      phones: (
        <div className="flex flex-col gap-1">
          {property.users.map((owner, index) => (
            <div key={owner.id}>
              {generateWhatsAppLink(owner.phone)}
            </div>
          ))}
        </div>
      ),
      description: property.description,
      // Campos adicionales para búsqueda (no se muestran en la tabla)
      ownerNames: property.users.map(user => user.name).join(' '),
      ownerLastNames: property.users.map(user => user.lastName).join(' '),
      ownerUsernames: property.users.map(user => user.username).join(' '),
      ownerFullNames: property.users.map(user => `${user.lastName}, ${user.name}`).join(' '),
      ...(user?.roles?.includes('admin') && { actions: <PropertyForm id={property.id} /> })
    }));

  const addButtonComponent = user?.roles?.includes('admin') ? <PropertyForm /> : null;

  const visibleColumns = user?.roles?.includes('admin')
    ? ["isMain", "address", "description", "owners", "phones", "actions"]
    : ["isMain", "address", "description", "owners", "phones"];

  return (
    <div className="w-full">
      <CustomTable
        data={transformedProperties}
        columns={columns}
        statusColorMap={statusColorMap}
        initialVisibleColumns={visibleColumns}
        addButtonComponent={addButtonComponent}
        title="propiedades"
        className="w-full"
      />
    </div>
  );
};