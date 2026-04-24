import { useState } from 'react';
import { GenericPage, Icons, UI } from '../../../shared';
import { InsuranceStatisticsCards, EmployeeInsuranceList } from '../components';
import { useExpiredInsurances, useExpiringSoonInsurances } from '../hooks';

export const EmployeeInsurancePage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const { data: expiredInsurances } = useExpiredInsurances();
  const { data: expiringSoonInsurances } = useExpiringSoonInsurances(30);

  return (
    <GenericPage
      backUrl="/home"
      icon={<Icons.IoReaderOutline size={26} />}
      title="Seguros de Empleados"
      bodyContent={
        <div className="flex w-full flex-col space-y-6">
          {/* Navigation Tabs */}
          <div className="flex justify-center w-full">
            <UI.Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              aria-label="Insurance tabs"
              size="lg"
              classNames={{
                tabList: "gap-2 sm:gap-3 lg:gap-4 border border-gray-200 dark:border-gray-700 p-1 sm:p-1.5 rounded-lg sm:rounded-xl w-auto",
                cursor: "border border-gray-200 dark:border-gray-700 shadow-sm rounded-md sm:rounded-lg",
                tab: "px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white responsive-text-sm sm:responsive-text-base",
                tabContent: "group-data-[selected=true]:text-gray-900 dark:group-data-[selected=true]:text-white font-medium"
              }}
            >
              <UI.Tab
                key="list"
                title={
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icons.IoListOutline size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Lista de Seguros</span>
                    <span className="sm:hidden">Lista</span>
                  </div>
                }
              />
              <UI.Tab
                key="dashboard"
                title={
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icons.IoStatsChartOutline size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Stats</span>
                  </div>
                }
              />
            </UI.Tabs>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'list' && (
              <EmployeeInsuranceList />
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <InsuranceStatisticsCards />

                {/* Alerts Section */}
                {((expiredInsurances?.length || 0) > 0 || (expiringSoonInsurances?.length || 0) > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expired Insurances Alert */}
                    {(expiredInsurances?.length || 0) > 0 && (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <Icons.IoWarningOutline size={24} className="text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                              Seguros Vencidos ({expiredInsurances?.length || 0})
                            </h3>
                            <div className="space-y-2">
                              {expiredInsurances?.slice(0, 3).map((insurance) => (
                                <div key={insurance.id} className="text-sm text-red-700 dark:text-red-300">
                                  <span className="font-medium">{insurance.employeeName}</span> - {insurance.insuranceCompany}
                                </div>
                              ))}
                              {(expiredInsurances?.length || 0) > 3 && (
                                <div className="text-sm text-red-600 dark:text-red-400">
                                  Y {(expiredInsurances?.length || 0) - 3} más...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expiring Soon Alert */}
                    {(expiringSoonInsurances?.length || 0) > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                            <Icons.IoTimeOutline size={24} className="text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                              Próximos a Vencer ({expiringSoonInsurances?.length || 0})
                            </h3>
                            <div className="space-y-2">
                              {expiringSoonInsurances?.slice(0, 3).map((insurance) => (
                                <div key={insurance.id} className="text-sm text-yellow-700 dark:text-yellow-300">
                                  <span className="font-medium">{insurance.employeeName}</span> - {insurance.insuranceCompany}
                                </div>
                              ))}
                              {(expiringSoonInsurances?.length || 0) > 3 && (
                                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                                  Y {(expiringSoonInsurances?.length || 0) - 3} más...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
                        <p>• Los administradores y personal de seguridad pueden ver todos los seguros.</p>
                        <p>• Los usuarios regulares solo pueden ver los seguros que han creado.</p>
                        <p>• Solo los administradores pueden eliminar registros de seguros.</p>
                        <p>• Los seguros se marcan automáticamente como vencidos según la fecha de expiración.</p>
                        <p>• Se recomienda renovar los seguros antes de su vencimiento.</p>
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