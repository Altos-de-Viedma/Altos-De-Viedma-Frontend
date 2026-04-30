import { useState } from 'react';
import { UI, Icons } from '../../../shared';
import { useCreateMonthlyPayment, useInitializeMonthlyPayments } from '../hooks/useMonthlyPayments';
import { useAllProperties } from '../../property/hooks';
import { getCurrentMonth, MONTH_NAMES } from '../helpers';

interface MonthlyPaymentFormProps {
  onSuccess?: () => void;
  selectedYear?: number;
  selectedMonth?: number;
}

export const MonthlyPaymentForm = ({
  onSuccess,
  selectedYear,
  selectedMonth
}: MonthlyPaymentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<'single' | 'initialize'>('single');
  const [propertyId, setPropertyId] = useState('');
  const [year, setYear] = useState(selectedYear || getCurrentMonth().year);
  const [month, setMonth] = useState(selectedMonth || getCurrentMonth().month);
  const [amountDue, setAmountDue] = useState('');
  const [defaultAmount, setDefaultAmount] = useState('');

  const { properties } = useAllProperties();
  const createPaymentMutation = useCreateMonthlyPayment();
  const initializePaymentsMutation = useInitializeMonthlyPayments();

  const isLoading = createPaymentMutation.isPending || initializePaymentsMutation.isPending;

  const handleSubmit = async () => {
    if (formType === 'single') {
      if (!propertyId || !amountDue) return;

      await createPaymentMutation.mutateAsync({
        propertyId,
        year,
        month,
        amountDue: parseFloat(amountDue),
      });
    } else {
      await initializePaymentsMutation.mutateAsync({
        year,
        month,
        defaultAmount: parseFloat(defaultAmount) || 0,
      });
    }

    handleClose();
    onSuccess?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setPropertyId('');
    setAmountDue('');
    setDefaultAmount('');
    setFormType('single');
  };

  return (
    <>
      <UI.Button
        color="primary"
        onPress={() => setIsOpen(true)}
        startContent={<Icons.IoAddOutline size={18} />}
      >
        Gestionar Pagos
      </UI.Button>

      <UI.Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        backdrop="blur"
        size="2xl"
        scrollBehavior="inside"
      >
        <UI.ModalContent>
          <UI.ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Gestionar Pagos Mensuales</h2>
            <p className="text-sm text-gray-500">
              Crear registros de pago para propiedades específicas o inicializar para todas
            </p>
          </UI.ModalHeader>

          <UI.ModalBody>
            <div className="space-y-6">
              {/* Form Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de operación
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="formType"
                      value="single"
                      checked={formType === 'single'}
                      onChange={(e) => setFormType(e.target.value as 'single' | 'initialize')}
                      className="text-primary-500"
                    />
                    <span>Propiedad específica</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="formType"
                      value="initialize"
                      checked={formType === 'initialize'}
                      onChange={(e) => setFormType(e.target.value as 'single' | 'initialize')}
                      className="text-primary-500"
                    />
                    <span>Inicializar todas las propiedades</span>
                  </label>
                </div>
              </div>

              {/* Month/Year Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Año
                  </label>
                  <UI.Select
                    selectedKeys={[year.toString()]}
                    onSelectionChange={(keys) => setYear(parseInt(Array.from(keys)[0] as string))}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const yearOption = new Date().getFullYear() - 2 + i;
                      return (
                        <UI.SelectItem key={yearOption.toString()}>
                          {yearOption}
                        </UI.SelectItem>
                      );
                    })}
                  </UI.Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mes
                  </label>
                  <UI.Select
                    selectedKeys={[month.toString()]}
                    onSelectionChange={(keys) => setMonth(parseInt(Array.from(keys)[0] as string))}
                  >
                    {MONTH_NAMES.map((monthName, index) => (
                      <UI.SelectItem key={(index + 1).toString()}>
                        {monthName}
                      </UI.SelectItem>
                    ))}
                  </UI.Select>
                </div>
              </div>

              {formType === 'single' ? (
                <>
                  {/* Property Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Propiedad *
                    </label>
                    <UI.Select
                      placeholder="Seleccionar propiedad"
                      selectedKeys={propertyId ? [propertyId] : []}
                      onSelectionChange={(keys) => setPropertyId(Array.from(keys)[0] as string)}
                    >
                      {properties?.map((property) => (
                        <UI.SelectItem key={property.id}>
                          <div className="flex items-center gap-2">
                            {property.isMain && <Icons.IoHomeOutline size={16} />}
                            <span>{property.address}</span>
                          </div>
                        </UI.SelectItem>
                      ))}
                    </UI.Select>
                  </div>

                  {/* Amount Due */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monto a pagar *
                    </label>
                    <UI.Input
                      type="number"
                      placeholder="Ingrese el monto..."
                      value={amountDue}
                      onValueChange={setAmountDue}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                      classNames={{
                        input: "text-right"
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Default Amount for All Properties */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Monto por defecto (opcional)
                    </label>
                    <UI.Input
                      type="number"
                      placeholder="Monto por defecto para todas las propiedades..."
                      value={defaultAmount}
                      onValueChange={setDefaultAmount}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">$</span>
                        </div>
                      }
                      classNames={{
                        input: "text-right"
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Se creará un registro de pago para cada propiedad activa. Puedes ajustar los montos individualmente después.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Icons.IoInformationCircleOutline size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          Inicializar pagos mensuales
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Esta acción creará registros de pago para todas las propiedades activas en {MONTH_NAMES[month - 1]} {year}.
                          Solo se crearán registros para propiedades que no tengan ya un registro para este mes.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </UI.ModalBody>

          <UI.ModalFooter>
            <UI.Button
              color="danger"
              variant="light"
              onPress={handleClose}
              isDisabled={isLoading}
            >
              Cancelar
            </UI.Button>
            <UI.Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isLoading}
              isDisabled={
                formType === 'single'
                  ? !propertyId || !amountDue || parseFloat(amountDue) <= 0
                  : false
              }
            >
              {formType === 'single' ? 'Crear Registro' : 'Inicializar Pagos'}
            </UI.Button>
          </UI.ModalFooter>
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};