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

    // Si es usuario normal, solo mostrar sus propias propiedades
    if (!user?.roles?.includes('admin') && !user?.roles?.includes('security')) {
      return properties.filter(property => property.user.id === user?.id);
    }

    // Admin y security ven todas las propiedades
    return properties;
  }, [properties, user]);

  const columns = [
    { name: "Principal", uid: "isMain" },
    { name: "Dirección", uid: "address" },
    { name: "Descripción", uid: "description" },
    { name: "Propietario", uid: "property" },
    { name: "Teléfono", uid: "phone" },
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
      property: (
        <UserModal user={property.user}>
          {`${property.user.lastName}, ${property.user.name}`}
        </UserModal>
      ),
      phone: generateWhatsAppLink(property.user.phone),
      description: property.description,
      ...(user?.roles?.includes('admin') && { actions: <PropertyForm id={property.id} /> })
    }));

  const addButtonComponent = user?.roles?.includes('admin') ? <PropertyForm /> : null;

  const visibleColumns = user?.roles?.includes('admin')
    ? ["isMain", "address", "description", "property", "phone", "actions"]
    : ["isMain", "address", "description", "property", "phone"];

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