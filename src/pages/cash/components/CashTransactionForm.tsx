import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { CashTransactionInputs, cashTransactionSchema } from '../validators';
import { useAddCashTransaction, useUpdateCashTransaction } from '../hooks';
import {
  TransactionType,
  TransactionCategory,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_TYPE_LABELS,
  ICashTransaction
} from '../interfaces';
import { useAuthStore } from '../../auth';

interface Props {
  transaction?: ICashTransaction;
  onSuccess?: () => void;
}

export const CashTransactionForm = ({ transaction, onSuccess }: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addTransaction, isPending: isAdding } = useAddCashTransaction();
  const { updateTransaction, isPending: isUpdating } = useUpdateCashTransaction();
  const { user } = useAuthStore((state) => ({ user: state.user }));

  const isEditing = !!transaction;
  const isPending = isAdding || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<CashTransactionInputs>({
    resolver: zodResolver(cashTransactionSchema),
    defaultValues: {
      amount: 0,
      type: TransactionType.ENTRY,
      category: TransactionCategory.OTHER_INCOME,
      description: ''
    }
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (isEditing && transaction) {
      reset({
        amount: Number(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        description: transaction.description || ''
      });
    }
  }, [isEditing, transaction, reset]);

  // Update default category when type changes
  useEffect(() => {
    if (selectedType === TransactionType.ENTRY) {
      setValue('category', TransactionCategory.OTHER_INCOME);
    } else {
      setValue('category', TransactionCategory.OTHER_EXPENSE);
    }
  }, [selectedType, setValue]);

  const onSubmit = async (data: CashTransactionInputs) => {
    try {
      if (isEditing && transaction) {
        await updateTransaction({ id: transaction.id, transaction: data });
      } else {
        await addTransaction(data);
      }

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    }
  };

  // Filter categories based on transaction type
  const getAvailableCategories = () => {
    if (selectedType === TransactionType.ENTRY) {
      return [TransactionCategory.OTHER_INCOME];
    } else {
      return Object.values(TransactionCategory).filter(cat => cat !== TransactionCategory.OTHER_INCOME);
    }
  };

  // Only admins can add/edit transactions
  if (!user?.roles?.includes('admin')) {
    return null;
  }

  return (
    <div>
      <UI.Button
        startContent={isEditing ? <Icons.IoPencilOutline size={20} /> : <Icons.IoAddOutline size={20} />}
        onPress={onOpen}
        color="primary"
        variant="solid"
        size={isEditing ? "sm" : "md"}
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
      >
        {isEditing ? 'Editar' : 'Nueva Transacción'}
      </UI.Button>

      <UI.Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        size="lg"
      >
        <UI.ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                <div className="flex items-center space-x-2 font-bold text-2xl">
                  <Icons.IoCashOutline size={24} className="text-gray-500" />
                  <h2>{isEditing ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UI.Input
                    label="Monto"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0.01"
                    variant="bordered"
                    classNames={{
                      input: "ml-2 mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                      innerWrapper: "items-end pb-1"
                    }}
                    startContent={
                      <span className="text-default-500 font-medium pb-[2px] pointer-events-none">$</span>
                    }
                    errorMessage={errors.amount?.message}
                    isInvalid={!!errors.amount}
                    {...register('amount', { valueAsNumber: true })}
                  />

                  <UI.Select
                    label="Tipo"
                    placeholder="Seleccione el tipo"
                    variant="bordered"
                    errorMessage={errors.type?.message}
                    isInvalid={!!errors.type}
                    {...register('type')}
                  >
                    {Object.values(TransactionType).map((type) => (
                      <UI.SelectItem key={type}>
                        {TRANSACTION_TYPE_LABELS[type]}
                      </UI.SelectItem>
                    ))}
                  </UI.Select>
                </div>

                <UI.Select
                  label="Categoría"
                  placeholder="Seleccione una categoría"
                  variant="bordered"
                  errorMessage={errors.category?.message}
                  isInvalid={!!errors.category}
                  {...register('category')}
                >
                  {getAvailableCategories().map((category) => (
                    <UI.SelectItem key={category}>
                      {TRANSACTION_CATEGORY_LABELS[category]}
                    </UI.SelectItem>
                  ))}
                </UI.Select>

                <UI.Textarea
                  label="Descripción (Opcional)"
                  placeholder="Ingrese una descripción de la transacción"
                  variant="bordered"
                  maxRows={3}
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                  {...register('description')}
                />
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={onClose}
                  isDisabled={isPending}
                  startContent={<Icons.IoCloseOutline size={20} />}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  variant="solid"
                  type="submit"
                  isLoading={isPending}
                  startContent={!isPending && <Icons.IoSaveOutline size={20} />}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </UI.Button>
              </UI.ModalFooter>
            </form>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};