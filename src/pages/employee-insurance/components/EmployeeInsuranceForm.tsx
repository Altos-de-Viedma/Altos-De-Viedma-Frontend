import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Icons, UI, SelectModal } from '../../../shared';
import { useAddEmployeeInsurance, useUpdateEmployeeInsurance, useApproveEmployeeInsurance, useRejectEmployeeInsurance } from '../hooks';
import { useProperties } from '../../property';
import { useAuthStore } from '../../auth/store/auth.store';
import {
  IEmployeeInsurance,
  ICreateEmployeeInsurance,

  InsuranceStatus,
  INSURANCE_STATUS_LABELS,
  ApprovalStatus
} from '../interfaces';

interface EmployeeInsuranceFormProps {
  insurance?: IEmployeeInsurance;
  onSuccess?: () => void;
}

export const EmployeeInsuranceForm = ({ insurance, onSuccess }: EmployeeInsuranceFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const isEditing = !!insurance;

  const { user } = useAuthStore((state) => ({ user: state.user }));
  const isAdmin = user?.roles?.includes('admin');

  const { mutate: createInsurance, isPending: isCreating } = useAddEmployeeInsurance();
  const { mutate: updateInsurance, isPending: isUpdating } = useUpdateEmployeeInsurance();
  const { mutate: approveInsurance, isPending: isApproving } = useApproveEmployeeInsurance();
  const { mutate: rejectInsurance, isPending: isRejecting } = useRejectEmployeeInsurance();
  const { properties } = useProperties();

  // Para usuario normal: su primera propiedad
  const userProperty = !isAdmin && properties?.length > 0 ? properties[0] : null;
  const userPropertyOwner = userProperty?.users?.[0] || null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ICreateEmployeeInsurance>({
    defaultValues: insurance ? {
      employeeName: insurance.employeeName,
      employeePosition: insurance.employeePosition,
      employeeDocument: insurance.employeeDocument,
      employeePhone: insurance.employeePhone || '',

      insuranceCompany: insurance.insuranceCompany,
      policyNumber: insurance.policyNumber,
      coverageAmount: insurance.coverageAmount,
      monthlyPremium: insurance.monthlyPremium,
      startDate: new Date(insurance.startDate).toISOString().split('T')[0],
      expirationDate: new Date(insurance.expirationDate).toISOString().split('T')[0],
      status: insurance.status,
      proofUrl: insurance.proofUrl || '',
      notes: insurance.notes || '',
      propertyId: insurance.propertyId || ''
    } : {}
  });

  const selectedPropertyId = watch('propertyId');

  // Para usuario normal: asignar su propiedad automáticamente
  useEffect(() => {
    if (!isAdmin && userProperty && !isEditing) {
      setValue('propertyId', userProperty.id);
    }
  }, [isAdmin, userProperty, isEditing, setValue]);

  // Obtener datos del dueño de la propiedad seleccionada (para admin)
  const selectedProperty = properties?.find(p => p.id === selectedPropertyId);
  const selectedPropertyOwner = selectedProperty?.users?.[0] || null;

  const onSubmit = (data: ICreateEmployeeInsurance) => {

    // Para usuario normal asignar su propiedad
    if (!isAdmin && userProperty) {
      data.propertyId = userProperty.id;
    }

    // Clean up empty strings for optional fields to avoid backend validation errors
    const cleanedData: any = { ...data };

    if (cleanedData.propertyId === '') cleanedData.propertyId = undefined;
    if (cleanedData.insuranceCompany === '') cleanedData.insuranceCompany = undefined;
    if (cleanedData.policyNumber === '') cleanedData.policyNumber = undefined;
    if (cleanedData.coverageAmount === '' || isNaN(Number(cleanedData.coverageAmount))) cleanedData.coverageAmount = undefined;
    if (cleanedData.monthlyPremium === '' || isNaN(Number(cleanedData.monthlyPremium))) cleanedData.monthlyPremium = undefined;
    if (cleanedData.startDate === '') cleanedData.startDate = undefined;
    if (cleanedData.notes === '') cleanedData.notes = undefined;

    if (isEditing && insurance) {
      updateInsurance(
        { id: insurance.id, insurance: cleanedData },
        {
          onSuccess: () => {
            setIsOpen(false);
            reset();
            onSuccess?.();
          }
        }
      );
    } else {
      createInsurance(cleanedData, {
        onSuccess: () => {
          setIsOpen(false);
          reset();
          onSuccess?.();
        }
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleApprove = () => {
    if (insurance) {
      approveInsurance({ id: insurance.id }, {
        onSuccess: () => {
          onSuccess?.();
          handleClose();
        }
      });
    }
  };

  const handleReject = () => {
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (insurance && rejectionReason.trim()) {
      rejectInsurance({ id: insurance.id, rejectionReason: rejectionReason.trim() }, {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          onSuccess?.();
          handleClose();
        }
      });
    }
  };

  return (
    <>
      <UI.Button
        onPress={() => setIsOpen(true)}
        color={isEditing ? "default" : "primary"}
        variant={isEditing ? "light" : "solid"}
        startContent={isEditing ? <Icons.IoPencilOutline size={16} /> : <Icons.IoAddOutline size={16} />}
        size="sm"
        className={isEditing ? "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" : "font-medium"}
      >
        {isEditing ? 'Editar' : 'Nuevo Seguro'}
      </UI.Button>

      <UI.Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
        isDismissable={false}
      >
        <UI.ModalContent>
          {() => (
            <>
              <UI.ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icons.IoReaderOutline size={24} className="text-primary" />
                  <span>{isEditing ? 'Editar Seguro de Empleado' : 'Nuevo Seguro de Empleado'}</span>
                </div>
              </UI.ModalHeader>
              <UI.ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Propiedad */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Propiedad Asociada
                      </h3>
                    </div>

                    {isAdmin ? (
                      /* Admin: selector de propiedad con buscador */
                      <div className="md:col-span-2">
                        <UI.Button
                          variant="bordered"
                          onPress={() => setIsPropertyModalOpen(true)}
                          className="justify-start h-14 px-3 w-full"
                          startContent={<Icons.IoHomeOutline size={20} />}
                        >
                          <div className="flex-1 text-left">
                            {selectedProperty ? (
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {selectedProperty.isMain ? '🏠 ' : ''}{selectedProperty.address}
                                </span>
                                <span className="text-xs text-default-500">
                                  {selectedProperty.users?.map(u => `${u.lastName}, ${u.name}`).join(' • ')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-default-400">Seleccionar propiedad...</span>
                            )}
                          </div>
                        </UI.Button>

                        <SelectModal
                          isOpen={isPropertyModalOpen}
                          onClose={() => setIsPropertyModalOpen(false)}
                          title="Seleccionar Propiedad"
                          options={(properties || []).map((property) => ({
                            key: property.id,
                            label: property.isMain ? `🏠 ${property.address}` : property.address,
                            description: property.users?.map(u => `${u.lastName}, ${u.name}`).join(' • ') || ''
                          }))}
                          selectedKeys={selectedPropertyId ? [selectedPropertyId] : []}
                          onSelectionChange={(keys) => {
                            const value = keys[0];
                            setValue('propertyId', value as string);
                          }}
                          selectionMode="single"
                          searchPlaceholder="Buscar propiedad..."
                        />

                        {/* Datos del dueño de la propiedad seleccionada */}
                        {selectedPropertyOwner && (
                          <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                              Propietario: {selectedPropertyOwner.lastName}, {selectedPropertyOwner.name}
                            </p>
                            {selectedPropertyOwner.phone && (
                              <p className="text-xs text-primary-600 dark:text-primary-400">
                                Tel: {selectedPropertyOwner.phone}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Usuario normal: muestra su propiedad automáticamente */
                      <div className="md:col-span-2">
                        {userProperty ? (
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {userProperty.isMain ? '🏠 ' : ''}{userProperty.address}
                            </p>
                            {userPropertyOwner && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Propietario: {userPropertyOwner.lastName}, {userPropertyOwner.name}
                                {userPropertyOwner.phone ? ` — Tel: ${userPropertyOwner.phone}` : ''}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No se encontró una propiedad asociada.</p>
                        )}
                      </div>
                    )}

                    {/* Información del Empleado */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-2">
                        Información del Empleado
                      </h3>
                    </div>

                    <UI.Input
                      {...register('employeeName', { required: 'El nombre es requerido' })}
                      label="Nombre Completo"
                      placeholder="Ingrese el nombre completo"
                      isInvalid={!!errors.employeeName}
                      errorMessage={errors.employeeName?.message}
                      startContent={<Icons.IoPersonOutline size={18} />}
                    />

                    <UI.Input
                      {...register('employeePosition', { required: 'El cargo es requerido' })}
                      label="Cargo/Posición"
                      placeholder="Ingrese el cargo"
                      isInvalid={!!errors.employeePosition}
                      errorMessage={errors.employeePosition?.message}
                      startContent={<Icons.IoPersonOutline size={18} />}
                    />

                    <UI.Input
                      {...register('employeeDocument', { required: 'El documento es requerido' })}
                      label="Documento de Identidad"
                      placeholder="Ingrese el documento"
                      isInvalid={!!errors.employeeDocument}
                      errorMessage={errors.employeeDocument?.message}
                      startContent={<Icons.IoIdCardOutline size={18} />}
                    />

                    <UI.Input
                      {...register('employeePhone', { required: 'El teléfono es requerido' })}
                      label="Teléfono"
                      placeholder="Ingrese el teléfono"
                      isInvalid={!!errors.employeePhone}
                      errorMessage={errors.employeePhone?.message}
                      startContent={<Icons.IoCallOutline size={18} />}
                    />

                    {/* Información del Seguro */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-4">
                        Información del Seguro
                      </h3>
                    </div>

                    <UI.Input
                      {...register('insuranceCompany')}
                      label="Compañía de Seguros"
                      placeholder="Ingrese la compañía (opcional)"
                      startContent={<Icons.IoHomeOutline size={18} />}
                    />

                    <UI.Input
                      {...register('policyNumber')}
                      label="Número de Póliza"
                      placeholder="Ingrese el número de póliza (opcional)"
                      startContent={<Icons.IoDocumentTextOutline size={18} />}
                    />

                    <UI.Select
                      {...register('status')}
                      label="Estado"
                      placeholder="Seleccione el estado"
                      defaultSelectedKeys={[InsuranceStatus.ACTIVE]}
                    >
                      {Object.entries(INSURANCE_STATUS_LABELS).map(([key, label]) => (
                        <UI.SelectItem key={key}>
                          {label}
                        </UI.SelectItem>
                      ))}
                    </UI.Select>

                    <UI.Input
                      {...register('coverageAmount')}
                      type="number"
                      step="0.01"
                      label="Monto de Cobertura"
                      placeholder="0.00 (opcional)"
                      startContent={<span className="text-default-400 text-small">$</span>}
                    />

                    <UI.Input
                      {...register('monthlyPremium')}
                      type="number"
                      step="0.01"
                      label="Prima Mensual"
                      placeholder="0.00 (opcional)"
                      startContent={<span className="text-default-400 text-small">$</span>}
                    />

                    <UI.Input
                      {...register('startDate')}
                      type="date"
                      label="Fecha de Inicio (opcional)"
                    />

                    <UI.Input
                      {...register('expirationDate', { required: 'La fecha de expiración es requerida' })}
                      type="date"
                      label="Fecha de Expiración"
                      isInvalid={!!errors.expirationDate}
                      errorMessage={errors.expirationDate?.message}
                    />

                    <UI.Input
                      {...register('proofUrl', { required: 'La URL del comprobante es requerida' })}
                      label="URL del Comprobante"
                      placeholder="https://..."
                      isInvalid={!!errors.proofUrl}
                      errorMessage={errors.proofUrl?.message}
                      startContent={<Icons.IoLinkOutline size={18} />}
                    />

                    <div className="md:col-span-2">
                      <UI.Textarea
                        {...register('notes')}
                        label="Notas Adicionales"
                        placeholder="Ingrese notas adicionales..."
                        minRows={3}
                      />
                    </div>
                  </div>
                </form>
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center w-full gap-4 pb-6">
                <UI.Button
                  color="danger"
                  variant="light"
                  onPress={handleClose}
                  startContent={<Icons.IoCloseOutline size={20} />}
                >
                  Cancelar
                </UI.Button>
                {isAdmin && isEditing && insurance && (
                  <>
                    {insurance.approvalStatus !== ApprovalStatus.REJECTED && (
                      <UI.Button
                        color="danger"
                        variant="solid"
                        onPress={handleReject}
                        isLoading={isRejecting}
                        startContent={!isRejecting ? <Icons.IoCloseOutline size={20} /> : undefined}
                        className="font-medium text-white shadow-md"
                      >
                        Rechazar
                      </UI.Button>
                    )}
                    {insurance.approvalStatus !== ApprovalStatus.APPROVED && (
                      <UI.Button
                        color="success"
                        variant="solid"
                        onPress={handleApprove}
                        isLoading={isApproving}
                        startContent={!isApproving ? <Icons.IoCheckmarkOutline size={20} /> : undefined}
                        className="font-medium text-white shadow-md"
                      >
                        Aprobar
                      </UI.Button>
                    )}
                  </>
                )}
                <UI.Button
                  color="primary"
                  onPress={() => handleSubmit(onSubmit)()}
                  isLoading={isCreating || isUpdating}
                  startContent={!(isCreating || isUpdating) ? <Icons.IoSaveOutline size={20} /> : undefined}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  {isEditing ? 'Actualizar' : 'Crear'}
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>

      {/* Rejection Reason Modal */}
      <UI.Modal
        isOpen={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        backdrop="blur"
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
                <div className="flex flex-col space-y-4">
                  <p className="text-base text-gray-700 dark:text-gray-300 text-center">
                    Por favor, indique la razón por la cual rechaza este seguro.
                  </p>
                  <UI.Textarea
                    label="Razón del rechazo"
                    placeholder="Ingrese la razón del rechazo..."
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
              </UI.ModalBody>
              <UI.ModalFooter className="flex justify-center gap-3">
                <UI.Button
                  color="default"
                  variant="light"
                  onPress={() => setIsRejectModalOpen(false)}
                  isDisabled={isRejecting}
                  startContent={<Icons.IoArrowBackOutline size={20} />}
                  className="font-medium"
                >
                  Cancelar
                </UI.Button>
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={confirmReject}
                  isLoading={isRejecting}
                  isDisabled={!rejectionReason.trim()}
                  startContent={!isRejecting ? <Icons.IoCloseOutline size={20} /> : undefined}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Confirmar Rechazo
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};