import { useState } from 'react';
import { GenericPage, Icons, UI } from '../../../shared';
import { CashSummaryCards, CashTransactionList, MonthlyBalancesList } from '../components';

export const CashPage = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <GenericPage
      backUrl="/home"
      icon={<Icons.IoCashOutline size={26} />}
      title="Caja"
      bodyContent={
        <div className="flex w-full flex-col space-y-6">
          {/* Navigation Tabs */}
          <div className="flex justify-center w-full">
            <UI.Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              aria-label="Cash tabs"
              size="lg"
              classNames={{
                tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
                cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
                tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
                tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
              }}
            >
              <UI.Tab
                key="transactions"
                title={
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icons.IoDocumentTextOutline size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Transacciones</span>
                    <span className="sm:hidden">Trans.</span>
                  </div>
                }
              />
              <UI.Tab
                key="summary"
                title={
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icons.IoGridOutline size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Resumen</span>
                    <span className="sm:hidden">Resumen</span>
                  </div>
                }
              />
            </UI.Tabs>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'transactions' && (
              <CashTransactionList />
            )}

            {activeTab === 'summary' && (
              <div className="space-y-6">
                <CashSummaryCards />

                {/* Monthly Balances */}
                <MonthlyBalancesList />

                {/* Quick Info */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Icons.IoInformationCircleOutline size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Información Importante
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>• Solo los administradores pueden agregar, editar o eliminar transacciones.</p>
                        <p>• Las transacciones solo se pueden modificar el día en que fueron creadas.</p>
                        <p>• Una vez que termina el día, las transacciones quedan bloqueadas.</p>
                        <p>• Todos los horarios están en zona horaria de Argentina (Buenos Aires).</p>
                        <p>• El balance total muestra el dinero acumulado desde el inicio del sistema.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};