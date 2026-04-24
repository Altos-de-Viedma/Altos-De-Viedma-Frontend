import { useState, useMemo } from 'react';
import { CustomTable, Icons, UI } from '../../../shared';
import { EmployeeInsuranceForm } from './EmployeeInsuranceForm';
import { useEmployeeInsurances, useDeleteEmployeeInsurance, useApproveEmployeeInsurance, useRejectEmployeeInsurance, useDeletedInsurances, useRestoreEmployeeInsurance } from '../hooks';
import { useAuthStore } from '../../auth/store/auth.store';
import { useProperties } from '../../property';
import {
  IEmployeeInsurance,
  APPROVAL_STATUS_LABELS,
  ApprovalStatus
} from '../interfaces';
import { formatDate, isExpired, isExpiringSoon, getDaysUntilExpiration } from '../helpers';

export const EmployeeInsuranceList = () => {
  const { data: insurances, isLoading, refetch } = useEmployeeInsurances();
  const { data: deletedInsurances, isLoading: isDeletedLoading } = useDeletedInsurances();
  const { mutate: deleteInsurance } = useDeleteEmployeeInsurance();
  const { mutate: approveInsurance } = useApproveEmployeeInsurance();
  const { mutate: rejectInsurance } = useRejectEmployeeInsurance();
  const { mutate: restoreInsurance } = useRestoreEmployeeInsurance();
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { properties } = useProperties();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [insuranceToDelete, setInsuranceToDelete] = useState<IEmployeeInsurance | null>(null);
  const [insuranceToApprove, setInsuranceToApprove] = useState<IEmployeeInsurance | null>(null);
  const [insuranceToReject, setInsuranceToReject] = useState<IEmployeeInsurance | null>(null);
  const [insuranceToRestore, setInsuranceToRestore] = useState<IEmployeeInsurance | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const isAdmin = user?.roles?.includes('admin');
  const isSecurity = user?.roles?.includes('security');
  const isPrivilegedUser = isAdmin || isSecurity;

  // Filter and search logic
  const filteredInsurances = useMemo(() => {
    const baseInsurances = activeTab === 'deleted' ? deletedInsurances : insurances;
    
    if (!baseInsurances) return [];

    return baseInsurances.filter((insurance) => {
      // Permission filter:
      // - Admin y Security ven todos
      // - Usuario normal solo ve los suyos
      if (!isPrivilegedUser && insurance.createdBy?.id !== user?.id) return false;

      // Tab filter
      if (activeTab === 'all' && insurance.approvalStatus === ApprovalStatus.REJECTED) return false;
      if (activeTab === 'expired' && !isExpired(insurance.expirationDate)) return false;
      if (activeTab === 'rejected' && insurance.approvalStatus !== ApprovalStatus.REJECTED) return false;
      if (activeTab === 'pending' && insurance.approvalStatus !== ApprovalStatus.PENDING) return false;
      if (activeTab === 'approved' && insurance.approvalStatus !== ApprovalStatus.APPROVED) return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          insurance.employeeName?.toLowerCase().includes(searchLower) ||
          insurance.employeePosition?.toLowerCase().includes(searchLower) ||
          insurance.employeeDocument?.toLowerCase().includes(searchLower) ||
          (insurance.insuranceCompany || '').toLowerCase().includes(searchLower) ||
          (insurance.policyNumber || '').toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [insurances, deletedInsurances, activeTab, searchTerm, isPrivilegedUser, user?.id]);

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

  const openApproveModal = (insurance: IEmployeeInsurance) => {
    setInsuranceToApprove(insurance);
    setApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (insuranceToApprove) {
      setIsApproving(true);
      approveInsurance({ id: insuranceToApprove.id }, {
        onSuccess: () => {
          setApproveModalOpen(false);
          setInsuranceToApprove(null);
          setIsApproving(false);
        },
        onError: () => {
          setIsApproving(false);
        }
      });
    }
  };

  const handleCancelApprove = () => {
    setApproveModalOpen(false);
    setInsuranceToApprove(null);
  };

  const openRejectModal = (insurance: IEmployeeInsurance) => {
    setInsuranceToReject(insurance);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (insuranceToReject && rejectionReason.trim()) {
      setIsRejecting(true);
      rejectInsurance({ id: insuranceToReject.id, rejectionReason: rejectionReason.trim() }, {
        onSuccess: () => {
          setRejectModalOpen(false);
          setInsuranceToReject(null);
          setRejectionReason('');
          setIsRejecting(false);
        },
        onError: () => {
          setIsRejecting(false);
        }
      });
    }
  };

  const handleCancelReject = () => {
    setRejectModalOpen(false);
    setInsuranceToReject(null);
    setRejectionReason('');
  };

  const openRestoreModal = (insurance: IEmployeeInsurance) => {
    setInsuranceToRestore(insurance);
    setRestoreModalOpen(true);
  };

  const handleConfirmRestore = () => {
    if (insuranceToRestore) {
      setIsRestoring(true);
      restoreInsurance(insuranceToRestore.id, {
        onSuccess: () => {
          setRestoreModalOpen(false);
          setInsuranceToRestore(null);
          setIsRestoring(false);
        },
        onError: () => {
          setIsRestoring(false);
        }
      });
    }
  };

  const handleCancelRestore = () => {
    setRestoreModalOpen(false);
    setInsuranceToRestore(null);
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

  if (isLoading || (activeTab === 'deleted' && isDeletedLoading)) {
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
    { name: "Vencimiento", uid: "expiration" },
    { name: "Aprobación", uid: "approval" },
    { name: "Acciones", uid: "actions", className: "text-center" }
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
    approval: (
      <div className="flex flex-col gap-1">
        {insurance.approvalStatus === ApprovalStatus.REJECTED ? (
          <UI.Tooltip content={`Razón: ${insurance.rejectionReason || 'Sin razón especificada'}`}>
            <UI.Chip
              color="danger"
              variant="flat"
              size="sm"
              className="font-medium cursor-pointer"
            >
              {APPROVAL_STATUS_LABELS[insurance.approvalStatus]}
            </UI.Chip>
          </UI.Tooltip>
        ) : (
          <UI.Chip
            color={
              insurance.approvalStatus === ApprovalStatus.APPROVED ? "success" : "warning"
            }
            variant="flat"
            size="sm"
            className="font-medium"
          >
            {APPROVAL_STATUS_LABELS[insurance.approvalStatus]}
          </UI.Chip>
        )}
      </div>
    ),
    actions: (
      <div className="relative flex items-center justify-center gap-2">
        {/* If in deleted tab, only show Restore and View Proof */}
        {activeTab === 'deleted' ? (
          <>
            {insurance.proofUrl && (
              <UI.Button
                size="sm"
                variant="light"
                onPress={() => window.open(insurance.proofUrl, '_blank')}
                startContent={<Icons.IoLinkOutline size={16} />}
              >
                Comprobante
              </UI.Button>
            )}
            <UI.Button
              size="sm"
              color="success"
              variant="light"
              onPress={() => openRestoreModal(insurance)}
              startContent={<Icons.IoRefreshOutline size={16} />}
            >
              Reactivar
            </UI.Button>
          </>
        ) : (
          <>
            {/* Approve/Reject buttons for admins */}
            {isAdmin && (
              <>
                {insurance.approvalStatus !== ApprovalStatus.APPROVED && (
                  <UI.Button
                    size="sm"
                    color="success"
                    variant="light"
                    onPress={() => openApproveModal(insurance)}
                    startContent={<Icons.IoCheckmarkOutline size={16} />}
                  >
                    Aprobar
                  </UI.Button>
                )}
                {insurance.approvalStatus !== ApprovalStatus.REJECTED && (
                  <UI.Button
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => openRejectModal(insurance)}
                    startContent={<Icons.IoCloseOutline size={16} />}
                  >
                    Rechazar
                  </UI.Button>
                )}
              </>
            )}
            {canEdit(insurance) && (
              <EmployeeInsuranceForm
                insurance={insurance}
                onSuccess={() => refetch()}
              />
            )}
            {insurance.proofUrl && (
              <UI.Button
                size="sm"
                variant="light"
                onPress={() => window.open(insurance.proofUrl, '_blank')}
                startContent={<Icons.IoLinkOutline size={16} />}
              >
                Comprobante
              </UI.Button>
            )}
            {canDelete(insurance) && (
              <UI.Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => openDeleteModal(insurance)}
                startContent={<Icons.IoTrashOutline size={16} />}
              >
                Eliminar
              </UI.Button>
            )}
          </>
        )}
      </div>
    )
    };
  });

  const visibleColumns = ["employee", "property", "company", "expiration", "approval", "actions"];

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Tabs */}
      <div className="w-full flex justify-center">
        <UI.Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          aria-label="Insurance filter tabs"
          size="lg"
          classNames={{
            tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
            cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
            tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
            tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
          }}
        >
          <UI.Tab
            key="all"
            title={
              <div className="flex items-center gap-2">
                <Icons.IoListOutline size={16} />
                <span>Todos</span>
              </div>
            }
          />
          <UI.Tab
            key="pending"
            title={
              <div className="flex items-center gap-2">
                <Icons.IoTimeOutline size={16} />
                <span>Pendientes</span>
              </div>
            }
          />
          <UI.Tab
            key="approved"
            title={
              <div className="flex items-center gap-2">
                <Icons.IoCheckmarkCircleOutline size={16} />
                <span>Aprobados</span>
              </div>
            }
          />
          <UI.Tab
            key="expired"
            title={
              <div className="flex items-center gap-2">
                <Icons.IoWarningOutline size={16} />
                <span>Vencidos</span>
              </div>
            }
          />
          <UI.Tab
            key="rejected"
            title={
              <div className="flex items-center gap-2">
                <Icons.IoCloseCircleOutline size={16} />
                <span>Rechazados</span>
              </div>
            }
          />
          {isAdmin && (
            <UI.Tab
              key="deleted"
              title={
                <div className="flex items-center gap-2">
                  <Icons.IoTrashOutline size={16} />
                  <span>Borrados</span>
                </div>
              }
            />
          )}
        </UI.Tabs>
      </div>

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
          {() => (
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

      {/* Modal de aprobación */}
      <UI.Modal
        isOpen={approveModalOpen}
        onOpenChange={setApproveModalOpen}
        backdrop="blur"
        isDismissable={false}
        placement="center"
      >
        <UI.ModalContent>
          {() => (
            <>
              <UI.ModalHeader className="flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Icons.IoCheckmarkOutline size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Aprobar Seguro</h2>
                </div>
              </UI.ModalHeader>
              <UI.ModalBody>
                {insuranceToApprove && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      ¿Está seguro de que desea aprobar este seguro?
                    </p>
                    <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {insuranceToApprove.employeeName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insuranceToApprove.employeePosition} — {insuranceToApprove.employeeDocument}
                      </p>
                      {insuranceToApprove.insuranceCompany && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compañía: {insuranceToApprove.insuranceCompany}
                        </p>
                      )}
                      {insuranceToApprove.policyNumber && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Póliza: {insuranceToApprove.policyNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center gap-3">
                <UI.Button
                  color="default"
                  variant="light"
                  onPress={handleCancelApprove}
                  isDisabled={isApproving}
                  startContent={<Icons.IoArrowBackOutline size={20} />}
                  className="font-medium"
                >
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="success"
                  variant="solid"
                  onPress={handleConfirmApprove}
                  isLoading={isApproving}
                  startContent={!isApproving ? <Icons.IoCheckmarkOutline size={20} /> : undefined}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Aprobar
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>

      {/* Modal de rechazo */}
      <UI.Modal
        isOpen={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        backdrop="blur"
        isDismissable={false}
        placement="center"
      >
        <UI.ModalContent>
          {() => (
            <>
              <UI.ModalHeader className="flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Icons.IoCloseOutline size={24} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Rechazar Seguro</h2>
                </div>
              </UI.ModalHeader>
              <UI.ModalBody>
                {insuranceToReject && (
                  <div className="flex flex-col space-y-4">
                    <div className="text-center">
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        ¿Está seguro de que desea rechazar este seguro?
                      </p>
                      <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {insuranceToReject.employeeName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {insuranceToReject.employeePosition} — {insuranceToReject.employeeDocument}
                        </p>
                        {insuranceToReject.insuranceCompany && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Compañía: {insuranceToReject.insuranceCompany}
                          </p>
                        )}
                        {insuranceToReject.policyNumber && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Póliza: {insuranceToReject.policyNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <UI.Textarea
                        label="Razón del rechazo"
                        placeholder="Ingrese la razón por la cual rechaza este seguro..."
                        value={rejectionReason}
                        onValueChange={setRejectionReason}
                        minRows={3}
                        maxRows={5}
                        isRequired
                        variant="bordered"
                        classNames={{
                          input: "resize-none",
                          inputWrapper: "border-gray-300 dark:border-gray-600"
                        }}
                      />
                    </div>
                  </div>
                )}
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center gap-3">
                <UI.Button
                  color="default"
                  variant="light"
                  onPress={handleCancelReject}
                  isDisabled={isRejecting}
                  startContent={<Icons.IoArrowBackOutline size={20} />}
                  className="font-medium"
                >
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={handleConfirmReject}
                  isLoading={isRejecting}
                  isDisabled={!rejectionReason.trim()}
                  startContent={!isRejecting ? <Icons.IoCloseOutline size={20} /> : undefined}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Rechazar
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>

      {/* Modal de reactivación (Restore) */}
      <UI.Modal
        isOpen={restoreModalOpen}
        onOpenChange={setRestoreModalOpen}
        backdrop="blur"
        isDismissable={false}
        placement="center"
      >
        <UI.ModalContent>
          {() => (
            <>
              <UI.ModalHeader className="flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Icons.IoRefreshOutline size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Reactivar Seguro</h2>
                </div>
              </UI.ModalHeader>
              <UI.ModalBody>
                {insuranceToRestore && (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      ¿Está seguro de que desea reactivar este seguro?
                    </p>
                    <div className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {insuranceToRestore.employeeName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insuranceToRestore.employeePosition} — {insuranceToRestore.employeeDocument}
                      </p>
                      {insuranceToRestore.insuranceCompany && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Compañía: {insuranceToRestore.insuranceCompany}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center gap-3">
                <UI.Button
                  color="default"
                  variant="light"
                  onPress={handleCancelRestore}
                  isDisabled={isRestoring}
                  startContent={<Icons.IoArrowBackOutline size={20} />}
                  className="font-medium"
                >
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="primary"
                  variant="solid"
                  onPress={handleConfirmRestore}
                  isLoading={isRestoring}
                  startContent={!isRestoring ? <Icons.IoRefreshOutline size={20} /> : undefined}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Reactivar
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};