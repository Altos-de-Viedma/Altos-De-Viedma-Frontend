import { InvoiceList } from '../components/InvoiceList';

export const InvoicePage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Facturas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Administra y controla todas las facturas del sistema
        </p>
      </div>
      <InvoiceList />
    </div>
  );
};