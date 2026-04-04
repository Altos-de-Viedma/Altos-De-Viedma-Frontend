import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Icons, UI, useDisclosure } from '../../../shared';
import { InvoiceInputs, invoiceSchema } from '../validators';
import { useAddInvoice, useInvoice, useUpdateInvoice } from '../hooks';
import { useProperties } from '../../property/hooks';

interface Props {
  id?: string;
}

export const InvoiceForm = ({ id }: Props) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { addInvoice, isPending: isAddingInvoice } = useAddInvoice();
  const { invoiceUpdate, isPending: isUpdatingInvoice } = useUpdateInvoice();
  const { properties } = useProperties();

  const { invoice, isLoading } = id ? useInvoice(id) : { invoice: null, isLoading: false };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InvoiceInputs>({
    resolver: zodResolver(invoiceSchema),
  });

  useEffect(() => {
    if (id && invoice) {
      reset({
        title: invoice.title,
        description: invoice.description || '',
        invoiceUrl: invoice.invoiceUrl,
        propertyId: invoice.property?.id || '',
      });
    }
  }, [id, invoice, reset]);

  const onSubmit = async (data: InvoiceInputs) => {
    if (id) {
      await invoiceUpdate({ invoice: data, id });
    } else {
      await addInvoice(data);
      reset();
    }
    onClose();
  };

  const isPending = isAddingInvoice || isUpdatingInvoice;

  if (id && isLoading) {
    return <UI.Spinner />;
  }

  return (
    <div>
      <UI.Button
        startContent={id ? '' : <Icons.IoAddOutline size={24} />}
        onPress={onOpen}
        color="primary"
        variant="solid"
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
      >
        {id ? <><Icons.IoPencilOutline size={24} /> Editar</> : 'Nueva Factura'}
      </UI.Button>

      <UI.Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
      >
        <UI.ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <UI.ModalHeader className="flex items-center justify-center px-4 py-3">
                <div className="flex items-center space-x-2 font-bold text-2xl">
                  <Icons.IoReceiptOutline size={24} className="text-gray-500" />
                  <h2>{id ? 'Editar factura' : 'Nueva factura'}</h2>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody>
                <UI.Select
                  label="Propiedad"
                  placeholder="Seleccione una propiedad"
                  variant="bordered"
                  errorMessage={errors.propertyId?.message}
                  isInvalid={!!errors.propertyId}
                  {...register('propertyId')}
                >
                  {properties.map((property) => (
                    <UI.SelectItem key={property.id}>
                      {property.isMain ? `🏠 ${property.address}` : property.address}
                    </UI.SelectItem>
                  ))}
                </UI.Select>

                <UI.Input
                  label="Título"
                  placeholder="Ingrese el título de la factura"
                  variant="bordered"
                  errorMessage={errors.title?.message}
                  isInvalid={!!errors.title}
                  {...register('title')}
                />

                <UI.Textarea
                  label="Descripción (Opcional)"
                  placeholder="Ingrese una descripción de la factura"
                  variant="bordered"
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                  {...register('description')}
                />

                <UI.Input
                  label="URL de la Factura"
                  placeholder="https://ejemplo.com/factura.pdf"
                  variant="bordered"
                  errorMessage={errors.invoiceUrl?.message}
                  isInvalid={!!errors.invoiceUrl}
                  {...register('invoiceUrl')}
                />
              </UI.ModalBody>

              <UI.ModalFooter className="flex justify-center space-x-2">
                <UI.Button
                  color="danger"
                  variant="solid"
                  onPress={onClose}
                  isDisabled={isPending}
                  startContent={<Icons.IoCloseOutline size={24} />}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Cancelar
                </UI.Button>

                <UI.Button
                  color="primary"
                  variant="solid"
                  type="submit"
                  isLoading={isPending}
                  startContent={!isPending && <Icons.IoSaveOutline size={24} />}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  Guardar
                </UI.Button>
              </UI.ModalFooter>
            </form>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </div>
  );
};