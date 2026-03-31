import { GenericPage, Icons } from '../../../shared';
import { InvoiceList } from '../components/InvoiceList';

export const InvoicePage = () => {
  return (
    <GenericPage
      backUrl="/home"
      icon={<Icons.IoReceiptOutline size={26} />}
      title="Facturas"
      bodyContent={<InvoiceList />}
    />
  );
};