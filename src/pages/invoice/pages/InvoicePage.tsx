import { useState } from 'react';
import { GenericPage, Icons, UI } from '../../../shared';
import { InvoiceList } from '../components/InvoiceList';
import { MonthlyPropertyStatus } from '../components/MonthlyPropertyStatus';

export const InvoicePage = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <GenericPage
      backUrl="/home"
      icon={<Icons.IoReceiptOutline size={26} />}
      title="Expensas"
      bodyContent={
        <div className="flex w-full flex-col space-y-6">
          {/* Navigation Tabs */}
          <div className="flex justify-center w-full">
            <UI.Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              aria-label="Expense tabs"
              size="lg"
              classNames={{
                tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
                cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
                tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
                tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
              }}
            >
              <UI.Tab
                key="invoices"
                title={
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icons.IoDocumentTextOutline size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Expensas</span>
                    <span className="sm:hidden">Exp.</span>
                  </div>
                }
              />
              <UI.Tab
                key="monthly"
                title={
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icons.IoCalendarOutline size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Estado Mensual</span>
                    <span className="sm:hidden">Mensual</span>
                  </div>
                }
              />
            </UI.Tabs>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'invoices' && <InvoiceList />}
            {activeTab === 'monthly' && <MonthlyPropertyStatus />}
          </div>
        </div>
      }
    />
  );
};