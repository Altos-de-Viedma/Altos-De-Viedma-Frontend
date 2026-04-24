import { useState, useMemo } from 'react';
import { CustomTable, Icons, UI } from '../../../shared';
import { EmployeeInsuranceForm } from './EmployeeInsuranceForm';
import { useEmployeeInsurances, useDeleteEmployeeInsurance } from '../hooks';
import { useAuthStore } from '../../auth/store/auth.store';
import { useProperties } from '../../property';
import {
  IEmployeeInsurance,
  INSURANCE_STATUS_LABELS,
  InsuranceStatus
} from '../interfaces';
import { formatCurrency, formatDate, isExpired, isExpiringSoon, getDaysUntilExpiration } from '../helpers';

export const EmployeeInsuranceList = () => {
  const { data: insurances, isLoading, refetch } = useEmployeeInsurances();
  const { mutate: deleteInsurance } = useDeleteEmployeeInsurance();
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { properties } = useProperties();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [insuranceToDelete, setInsuranceToDelete] = useState<IEmployeeInsurance | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.roles?.includes('admin');
  const isSecurity = user?.roles?.includes('security');
  const isPrivilegedUser = isAdmin || isSecurity;

  // Filter and search logic
  const filteredInsurances = useMemo(() => {
    if (!insurances) return [];

    return insurances.filter((insurance) => {
      // Permission filter:
      // - Admin y Security ven todos
      // - Usuario normal solo ve los suyos
      if (!isPrivilegedUser && insurance.createdBy?.id !== user?.id) return false;

      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'expired' && !isExpired(insurance.expirationDate)) return false;
        if (filterStatus === 'expiring-soon' && !isExpiringSoon(insurance.expirationDate, 30)) return false;
        if (filterStatus !== 'expired' && filterStatus !== 'expiring-soon' && insurance.status !== filterStatus) return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          insurance.employeeName.toLowerCase().includes(searchLower) ||
          insurance.employeePosition.toLowerCase().includes(searchLower) ||
          insurance.employeeDocument.toLowerCase().includes(searchLower) ||
          insurance.insuranceCompany.toLowerCase().includes(searchLower) ||
          insurance.policyNumber.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [insurances, filterStatus, searchTerm, isPrivilegedUser, user?.id]);

  const openDeleteModal = (insurance: IEmployeeInsurance) => {
    setInsuranceToDelete(insurance);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (insuranceToDelete) {
      setIsDeleting(true);
      deleteInsurance(insuranceToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setInsuranceToDelete(null);
          setIsDeleting(false);
        },
        onError: () => {
          setIsDeleting(false);
        }
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setInsuranceToDelete(null);
  };

  // Permisos para editar:
  // - Admin: puede editar cualquier seguro
  // - Security: puede editar cualquier seguro
  // - Usuario normal: solo puede editar los suyos
  const canEdit = (insurance: IEmployeeInsurance) => {
    if (isAdmin || isSecurity) return true;
    return insurance.createdBy?.id === user?.id;
  };

  // Permisos para eliminar:
  // - Admin: puede eliminar cualquier seguro
  // - Security: NO puede eliminar
  // - Usuario normal: solo puede eliminar los suyos
  const canDelete = (insurance: IEmployeeInsurance) => {
    if (isAdmin) return true;
    if (isSecurity) return false;
    return insurance.createdBy?.id === user?.id;
  };

  if (isLoading) {
    return (
      <div className="center-flex py-12">
        <UI.Spinner size="lg" color="primary" />
      </div>
    );
  }

  const columns = [
    { name: "Empleado", uid: "employee" },
    { name: "Propiedad", uid: "property" },
    { name: "Compañía", uid: "company" },
    { name: "Cobertura", uid: "coverage" },
    { name: "Prima Mensual", uid: "premium" },
    { name: "Vencimiento", uid: "expiration" },
    { name: "Estado", uid: "status" },
    { name: "Acciones", uid: "actions" }
  ];

  const tableData = filteredInsurances.map(insurance => {
    const property = properties?.find(p => p.id === insurance.propertyId);
    const propertyOwner = property?.users?.[0];

    return {
    ...insurance,
    employee: (
      <div className="flex flex-col">
        <p className="text-bold text-sm capitalize">{insurance.employeeName}</p>
        <p className="text-bold text-sm capitalize text-default-400">{insurance.employeePosition}</p>
        <p className="text-bold text-xs text-default-400">{insurance.employeeDocument}</p>
      </div>
    ),
    property: (
      <div className="flex flex-col">
        {property ? (
          <>
            <p className="text-bold text-sm">{property.isMain ? '🏠 ' : ''}{property.address}</p>
            {propertyOwner && (
              <p className="text-bold text-xs text-default-400">
                {propertyOwner.lastName}, {propertyOwner.name}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-default-400">Sin propiedad</p>
        )}
      </div>
    ),
    company: (
      <div className="flex flex-col">
        <p className="text-bold text-sm">{insurance.insuranceCompany}</p>
        <p className="text-bold text-xs text-default-400">{insurance.policyNumber}</p>
      </div>
    ),
    coverage: (
      <span className="font-mono font-bold text-sm">
        {formatCurrency(Number(insurance.coverageAmount))}
      </span>
    ),
    premium: (
      <span className="font-mono font-bold text-sm">
        {formatCurrency(Number(insurance.monthlyPremium))}
      </span>
    ),
    expiration: (
      <div className="flex flex-col">
        <p className="text-bold text-sm">{formatDate(insurance.expirationDate)}</p>
        {isExpired(insurance.expirationDate) ? (
          <UI.Chip color="danger" variant="flat" size="sm">
            Vencido
          </UI.Chip>
        ) : isExpiringSoon(insurance.expirationDate, 30) ? (
          <UI.Chip color="warning" variant="flat" size="sm">
            {getDaysUntilExpiration(insurance.expirationDate)} días
          </UI.Chip>
        ) : (
          <UI.Chip color="success" variant="flat" size="sm">
            Vigente
          </UI.Chip>
        )}
      </div>
    ),
    status: (
      <UI.Chip
        color={
          insurance.status === InsuranceStatus.ACTIVE ? "success" :
          insurance.status === InsuranceStatus.EXPIRED ? "danger" :
          insurance.status === InsuranceStatus.PENDING ? "warning" : "default"
        }
        variant="flat"
        size="sm"
      >
        {INSURANCE_STATUS_LABELS[insurance.status]}
      </UI.Chip>
    ),
    actions: (
      <div className="relative flex items-center gap-2">
        {canEdit(insurance) && (
          <EmployeeInsuranceForm
            insurance={insurance}
            onSuccess={() => refetch()}
          />
        )}
        {insurance.proofUrl && (
          <UI.Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => window.open(insurance.proofUrl, '_blank')}
          >
            <Icons.IoLinkOutline size={16} />
          </UI.Button>
        )}
        {canDelete(insurance) && (
          <UI.Button
            isIconOnly
            size="sm"
            color="danger"
            variant="light"
            onPress={() => openDeleteModal(insurance)}
          >
            <Icons.IoTrashOutline size={16} />
          </UI.Button>
        )}
      </div>
    )
    };
  });

  const visibleColumns = ["employee", "property", "company", "coverage", "premium", "expiration", "status", "actions"];

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <UI.Input
              placeholder="Buscar por empleado, documento, compañía..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Icons.IoSearchOutline size={18} />}
              isClearable
              onClear={() => setSearchTerm('')}
            />
          </div>

          <div className="flex gap-2">
            <UI.Select
              placeholder="Estado"
              selectedKeys={[filterStatus]}
              onSelectionChange={(keys) => setFilterStatus(Array.from(keys)[0] as string)}
              className="w-40"
              size="sm"
            >
              <UI.SelectItem key="all" value="all">Todos</UI.SelectItem>
              <UI.SelectItem key="active" value="active">Activos</UI.SelectItem>
              <UI.SelectItem key="expired" value="expired">Vencidos</UI.SelectItem>
              <UI.SelectItem key="expiring-soon" value="expiring-soon">Por vencer</UI.SelectItem>
              <UI.SelectItem key="pending" value="pending">Pendientes</UI.SelectItem>
              <UI.SelectItem key="inactive" value="inactive">Inactivos</UI.SelectItem>
            </UI.Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Icons.IoReaderOutline size={16} />
          <span>{filteredInsurances.length} seguros</span>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <CustomTable
          data={tableData}
          columns={columns}
          initialVisibleColumns={visibleColumns}
          addButtonComponent={<EmployeeInsuranceForm onSuccess={() => refetch()} />}
          title="Seguros de Empleados"
          className="w-full shadow-lg border border-gray-200 dark:border-gray-700 p-4 rounded-xl"
          showAllRows={true}
        />
      </div>

      {/* Modal de confirmación de eliminación */}
      <UI.Modal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        backdrop="blur"
        isDismissable={false}
        placement="center"
      >
        <UI.ModalContent>
          {(onClose) => (
            <>
              <UI.ModalHeader className="flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Icons.IoTrashOutline size={24} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Eliminar Seguro</h2>
                </div>
              </UI.ModalHeader>
              <UI.ModalBody>
                {insuranceToDelete && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      ¿Está seguro de que desea eliminar este seguro?
                    </p>
                    <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {insuranceToDelete.employeeName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insuranceToDelete.employeePosition} — {insuranceToDelete.employeeDocument}
                      </p>
                      {insuranceToDelete.insuranceCompany && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compañía: {insuranceToDelete.insuranceCompany}
                        </p>
                      )}
                      {insuranceToDelete.policyNumber && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Póliza: {insuranceToDelete.policyNumber}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                )}
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center gap-3">
                <UI.Button
                  color="default"
                  variant="light"
                  onPress={handleCancelDelete}
                  isDisabled={isDeleting}
                  startContent={<Icons.IoArrowBackOutline size={20} />}
                  className="font-medium"
                >
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                  startContent={!isDeleting ? <Icons.IoTrashOutline size={20} /> : undefined}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Eliminar
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};