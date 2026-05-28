import { UI, Icons, Formatters } from '../../../shared';
import { usePaidInvoices } from '../hooks/useLiquidaciones';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string | null;
}

export const PaidInvoicesHistoryModal = ({ isOpen, onClose, propertyId }: Props) => {
  const { data: invoices, isLoading } = usePaidInvoices(propertyId);

  return (
    <UI.Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()} size="3xl">
      <UI.ModalContent>
        {(onClose) => (
          <>
            <UI.ModalHeader className="flex flex-col gap-1">
              <h2>Historial de Expensas Pagadas</h2>
            </UI.ModalHeader>
            <UI.ModalBody>
              {isLoading ? (
                <div className="flex justify-center p-8"><UI.Spinner /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3">Descripción</th>
                        <th className="px-6 py-3 text-center">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices?.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                            No hay expensas pagadas para esta propiedad.
                          </td>
                        </tr>
                      ) : (
                        invoices?.map((invoice) => (
                          <tr key={invoice.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <td className="px-6 py-4 font-medium">
                              {Formatters.formatDate(invoice.date)}
                            </td>
                            <td className="px-6 py-4">
                              {invoice.title}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {invoice.invoiceUrl ? (
                                <a 
                                  href={invoice.invoiceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800"
                                >
                                  <Icons.IoLinkOutline size={18} />
                                  Ver Comprobante
                                </a>
                              ) : (
                                <span className="text-gray-400">Sin link</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </UI.ModalBody>
            <UI.ModalFooter>
              <UI.Button color="primary" onPress={onClose}>
                Cerrar
              </UI.Button>
            </UI.ModalFooter>
          </>
        )}
      </UI.ModalContent>
    </UI.Modal>
  );
};
