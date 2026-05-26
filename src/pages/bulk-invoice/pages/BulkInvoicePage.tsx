import { useState } from 'react';
import { GenericPage, Icons } from '../../../shared';
import { toast } from 'react-toastify';
import { BulkInvoiceItem, BulkInvoiceResult, bulkCreateInvoices } from '../services/actions';

interface ParsedItem extends BulkInvoiceItem {
  originalPhone: string;
}

export const BulkInvoicePage = () => {
  const [rawText, setRawText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [results, setResults] = useState<BulkInvoiceResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step, setStep] = useState<'input' | 'preview' | 'results'>('input');

  const formatPhone = (phone: string): string => {
    return phone.replace(/[\s\-\(\)]/g, '');
  };

  const parseAmount = (amountStr: string): number => {
    // Replace comma with dot for decimal separator
    const cleaned = amountStr.replace(',', '.');
    return parseFloat(cleaned);
  };

  const handleParse = () => {
    setIsProcessing(true);
    try {
      const lines = rawText.trim().split('\n').filter(line => line.trim() !== '');
      const items: ParsedItem[] = [];

      for (const line of lines) {
        const parts = line.split('\t');
        if (parts.length < 5) {
          toast.error(`Línea con formato incorrecto: ${line.substring(0, 50)}...`);
          setIsProcessing(false);
          return;
        }

        const [phone, name, amount, date, invoiceUrl] = parts;
        const formattedPhone = formatPhone(phone.trim());
        const parsedAmount = parseAmount(amount.trim());

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          toast.error(`Monto inválido para ${name.trim()}: ${amount}`);
          setIsProcessing(false);
          return;
        }

        items.push({
          originalPhone: phone.trim(),
          phone: formattedPhone,
          name: name.trim(),
          amount: parsedAmount,
          date: date.trim(),
          invoiceUrl: invoiceUrl.trim()
        });
      }

      setParsedItems(items);
      setStep('preview');
      toast.success(`${items.length} registros parseados correctamente`);
    } catch (error) {
      toast.error('Error al parsear los datos');
    }
    setIsProcessing(false);
  };

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      const itemsToSend: BulkInvoiceItem[] = parsedItems.map(({ originalPhone, ...rest }) => rest);
      const response = await bulkCreateInvoices(itemsToSend);
      setResults(response.results);
      setStep('results');

      const successCount = response.results.filter(r => r.success).length;
      const failCount = response.results.filter(r => !r.success).length;

      if (failCount === 0) {
        toast.success(`✅ ${successCount} expensas creadas exitosamente`);
      } else {
        toast.warning(`${successCount} exitosas, ${failCount} con errores`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al crear las expensas');
    }
    setIsSending(false);
  };

  const handleReset = () => {
    setRawText('');
    setParsedItems([]);
    setResults([]);
    setStep('input');
  };

  const renderInput = () => (
    <div className="flex flex-col gap-4">
      <div className="bg-default-50 dark:bg-default-100/50 rounded-xl p-4 border border-default-200">
        <div className="flex items-center gap-2 mb-2">
          <Icons.IoInformationCircleOutline className="text-primary-500 text-xl" />
          <span className="text-sm font-medium text-foreground/80">Formato esperado (separado por tabs):</span>
        </div>
        <code className="text-xs text-foreground/60 block bg-default-100 dark:bg-default-200/30 rounded-lg p-3 font-mono">
          54 9 11 6538-7381⇥Naty Casonato⇥100000,60⇥9-5-26⇥https://drive.google.com/...
        </code>
      </div>

      <textarea
        id="bulk-invoice-textarea"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Pegá acá los datos de las expensas..."
        className="w-full min-h-[300px] p-4 rounded-xl border-2 border-default-200 bg-default-50 dark:bg-default-100/30 text-foreground font-mono text-sm focus:border-primary-500 focus:outline-none transition-colors resize-y"
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground/50">
          {rawText.trim().split('\n').filter(l => l.trim()).length} líneas detectadas
        </span>
        <button
          id="btn-parse"
          onClick={handleParse}
          disabled={!rawText.trim() || isProcessing}
          className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-default-300 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary-500/25 disabled:shadow-none"
        >
          <Icons.IoSearchOutline className="text-lg" />
          {isProcessing ? 'Procesando...' : 'Procesar'}
        </button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Vista previa - {parsedItems.length} registros
        </h3>
        <div className="flex gap-2">
          <button
            id="btn-back"
            onClick={() => setStep('input')}
            className="px-4 py-2 bg-default-200 hover:bg-default-300 text-foreground rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Icons.IoArrowBackOutline className="text-lg" />
            Volver
          </button>
          <button
            id="btn-submit"
            onClick={handleSubmit}
            disabled={isSending}
            className="px-6 py-2.5 bg-success-500 hover:bg-success-600 disabled:bg-default-300 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-success-500/25 disabled:shadow-none"
          >
            <Icons.IoCheckmarkCircleOutline className="text-lg" />
            {isSending ? 'Creando...' : `Crear ${parsedItems.length} Expensas`}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-default-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-default-100 dark:bg-default-50/50">
              <th className="text-left p-3 font-semibold text-foreground/70">#</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Teléfono</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Nombre</th>
              <th className="text-right p-3 font-semibold text-foreground/70">Monto</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Fecha</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Comprobante</th>
            </tr>
          </thead>
          <tbody>
            {parsedItems.map((item, idx) => (
              <tr key={idx} className="border-t border-default-100 hover:bg-default-50/50 transition-colors">
                <td className="p-3 text-foreground/50">{idx + 1}</td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-foreground">{item.phone}</span>
                    <span className="text-xs text-foreground/40">{item.originalPhone}</span>
                  </div>
                </td>
                <td className="p-3 font-medium text-foreground">{item.name}</td>
                <td className="p-3 text-right font-semibold text-success-500">$ {item.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                <td className="p-3 text-foreground/70">{item.date}</td>
                <td className="p-3">
                  <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
                    <Icons.IoLinkOutline className="text-lg" />
                    Ver
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-default-200 bg-default-50/50">
              <td colSpan={3} className="p-3 font-semibold text-foreground/70">Total</td>
              <td className="p-3 text-right font-bold text-lg text-success-600">
                $ {parsedItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-foreground">Resultados</h3>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-success-100 text-success-700 text-sm font-medium">
              ✅ {results.filter(r => r.success).length} exitosas
            </span>
            {results.filter(r => !r.success).length > 0 && (
              <span className="px-3 py-1 rounded-full bg-danger-100 text-danger-700 text-sm font-medium">
                ❌ {results.filter(r => !r.success).length} con errores
              </span>
            )}
          </div>
        </div>
        <button
          id="btn-reset"
          onClick={handleReset}
          className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary-500/25"
        >
          <Icons.IoAddOutline className="text-lg" />
          Nueva Carga
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-default-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-default-100 dark:bg-default-50/50">
              <th className="text-left p-3 font-semibold text-foreground/70">Estado</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Teléfono</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Nombre dado</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Propietario</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Propiedad</th>
              <th className="text-right p-3 font-semibold text-foreground/70">Monto</th>
              <th className="text-left p-3 font-semibold text-foreground/70">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} className={`border-t border-default-100 transition-colors ${
                result.success ? 'hover:bg-success-50/30' : 'bg-danger-50/20 hover:bg-danger-50/40'
              }`}>
                <td className="p-3">
                  {result.success ? (
                    <span className="text-success-500 text-xl"><Icons.IoCheckmarkCircle /></span>
                  ) : (
                    <span className="text-danger-500 text-xl"><Icons.IoCloseCircle /></span>
                  )}
                </td>
                <td className="p-3 font-mono text-foreground">{result.phone}</td>
                <td className="p-3 text-foreground">{result.name}</td>
                <td className="p-3 font-medium text-foreground">{result.userName || '-'}</td>
                <td className="p-3 text-foreground/70">{result.propertyAddress || '-'}</td>
                <td className="p-3 text-right font-semibold text-success-500">
                  {result.amount ? `$ ${result.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '-'}
                </td>
                <td className="p-3">
                  {result.success ? (
                    <span className="text-xs text-success-600">Creada correctamente</span>
                  ) : (
                    <span className="text-xs text-danger-600">{result.error}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <GenericPage
      backUrl="/home"
      icon={<Icons.IoCloudUploadOutline />}
      title="Carga Masiva de Expensas"
      bodyContent={
        <div className="max-w-6xl mx-auto">
          {step === 'input' && renderInput()}
          {step === 'preview' && renderPreview()}
          {step === 'results' && renderResults()}
        </div>
      }
    />
  );
};
