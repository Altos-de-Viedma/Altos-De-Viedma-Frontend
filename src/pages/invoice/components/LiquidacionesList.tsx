import { useState, useMemo } from 'react';
import { UI, Icons, Formatters } from '../../../shared';
import { useLiquidaciones, useUpdatePropertyAmounts } from '../hooks/useLiquidaciones';
import { PaidInvoicesHistoryModal } from './PaidInvoicesHistoryModal';
import { useAuthStore } from '../../auth/store';

export const LiquidacionesList = () => {
  const { data: properties, isLoading } = useLiquidaciones();
  const { mutate: updateAmounts } = useUpdatePropertyAmounts();
  const { user } = useAuthStore();

  const canEdit = user?.roles?.includes('admin') || user?.roles?.includes('superadmin');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMonthly, setEditMonthly] = useState<string>('');
  const [editDebt, setEditDebt] = useState<string>('');
  
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    let sorted = [...properties].sort((a, b) => 
      a.address.localeCompare(b.address, undefined, { numeric: true, sensitivity: 'base' })
    );
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return sorted.filter(p => p.address.toLowerCase().includes(lowerSearch));
    }
    
    return sorted;
  }, [properties, searchTerm]);

  const handleEdit = (property: any) => {
    setEditingId(property.id);
    setEditMonthly(property.monthlyExpenseAmount?.toString() || '0');
    setEditDebt(property.accumulatedDebt?.toString() || '0');
  };

  const handleSave = (id: string) => {
    updateAmounts({
      id,
      monthlyExpenseAmount: parseFloat(editMonthly) || 0,
      accumulatedDebt: parseFloat(editDebt) || 0,
    }, {
      onSuccess: () => {
        setEditingId(null);
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-8"><UI.Spinner /></div>;

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full sm:w-1/2 md:w-1/3">
        <UI.Input 
          placeholder="Buscar propiedad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<Icons.IoSearchOutline className="text-gray-400" />}
          isClearable
          onClear={() => setSearchTerm('')}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Propiedad</th>
                <th className="px-6 py-4">Paga por Mes</th>
                <th className="px-6 py-4">Deuda Acumulada</th>
                <th className="px-6 py-4">Último Pago</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties?.map((property) => (
                <tr key={property.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {property.address}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === property.id ? (
                      <UI.Input 
                        type="number"
                        size="sm"
                        value={editMonthly}
                        onChange={(e) => setEditMonthly(e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {Formatters.formatCurrency(property.monthlyExpenseAmount || 0)}
                        {canEdit && (
                          <button onClick={() => handleEdit(property)} className="text-gray-500 hover:text-primary-600">
                            <Icons.IoPencilOutline size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === property.id ? (
                      <UI.Input 
                        type="number"
                        size="sm"
                        value={editDebt}
                        onChange={(e) => setEditDebt(e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={(property.accumulatedDebt || 0) > 0 ? "text-danger-500 font-medium" : "text-success-500 font-medium"}>
                          {Formatters.formatCurrency(property.accumulatedDebt || 0)}
                        </span>
                        {canEdit && (
                          <button onClick={() => handleEdit(property)} className="text-gray-500 hover:text-primary-600">
                            <Icons.IoPencilOutline size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {property.lastPaymentDate ? Formatters.formatDate(property.lastPaymentDate) : <span className="text-gray-400">Sin pagos</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {editingId === property.id ? (
                      <div className="flex justify-center gap-2">
                        <UI.Button size="sm" color="success" onPress={() => handleSave(property.id)}>Guardar</UI.Button>
                        <UI.Button size="sm" color="danger" variant="flat" onPress={() => setEditingId(null)}>Cancelar</UI.Button>
                      </div>
                    ) : (
                      <UI.Button 
                        size="sm" 
                        color="primary" 
                        variant="flat"
                        startContent={<Icons.IoListOutline size={16} />}
                        onPress={() => setSelectedPropertyId(property.id)}
                      >
                        Ver expensas pagas
                      </UI.Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredProperties?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron propiedades
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaidInvoicesHistoryModal 
        isOpen={!!selectedPropertyId} 
        onClose={() => setSelectedPropertyId(null)} 
        propertyId={selectedPropertyId} 
      />
    </div>
  );
};
