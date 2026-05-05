import React, { useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button
} from '@heroui/react';
import { Icons } from '../../../shared';
import { toast } from 'react-toastify';

import { OwnersList, MessageForm, SendingProgress, ConfirmSendModal } from '../components';
import { useOwners, useSendMassMessages } from '../hooks';
import { MassMessageFormData } from '../validators';

export const MassMessagingPage: React.FC = () => {
  const [selectedOwnerIds, setSelectedOwnerIds] = useState<string[]>([]);
  const [lastResults, setLastResults] = useState<{ successful: number; failed: number } | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>('');

  // Fetch owners data
  const { data: owners = [], isLoading: ownersLoading, error: ownersError, refetch } = useOwners();

  // Send messages hook
  const { sendMassMessages, isLoading: isSending, isActive, progress, reset } = useSendMassMessages({
    onSuccess: (results) => {
      setLastResults(results);
      setSelectedOwnerIds([]); // Clear selection after successful send
      setIsConfirmModalOpen(false);
      setPendingMessage('');
    },
    onError: (error) => {
      console.error('Error sending mass messages:', error);
      setIsConfirmModalOpen(false);
      setPendingMessage('');
    }
  });

  // Get selected owners data
  const selectedOwners = useMemo(() => {
    return owners.filter(owner => selectedOwnerIds.includes(owner.id));
  }, [owners, selectedOwnerIds]);

  const handleSendMessage = (data: MassMessageFormData) => {
    if (selectedOwners.length === 0) {
      toast.error('Debe seleccionar al menos un propietario');
      return;
    }

    if (!data.message.trim()) {
      toast.error('Debe escribir un mensaje');
      return;
    }

    // Abrir modal de confirmación en lugar del popup asqueroso
    setPendingMessage(data.message);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSend = () => {
    sendMassMessages({
      message: pendingMessage,
      recipients: selectedOwners
    });
  };

  const handleCancelSend = () => {
    setIsConfirmModalOpen(false);
    setPendingMessage('');
  };

  const handleRefresh = () => {
    refetch();
    setSelectedOwnerIds([]);
    setLastResults(undefined);
    reset();
  };

  if (ownersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardBody className="flex flex-col items-center justify-center py-12">
            <Icons.IoWarningOutline className="w-12 h-12 text-danger mb-4" />
            <h3 className="text-lg font-semibold text-danger mb-2">Error al cargar datos</h3>
            <p className="text-foreground/60 text-center mb-4">
              No se pudieron cargar los datos de los propietarios. Verifique su conexión e intente nuevamente.
            </p>
            <Button
              color="primary"
              variant="flat"
              startContent={<Icons.IoRefreshOutline className="w-4 h-4" />}
              onPress={handleRefresh}
            >
              Reintentar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Icons.IoChatbubblesOutline className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Mensajes Masivos</h1>
                    <p className="text-foreground/60">
                      Envía mensajes a múltiples propietarios de forma simultánea
                    </p>
                  </div>
                </div>
                <Button
                  variant="flat"
                  startContent={<Icons.IoRefreshOutline className="w-4 h-4" />}
                  onPress={handleRefresh}
                  isDisabled={isSending || isActive}
                >
                  Actualizar
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Owners List */}
          <div className="space-y-6">
            <OwnersList
              owners={owners}
              selectedOwners={selectedOwnerIds}
              onSelectionChange={setSelectedOwnerIds}
              isLoading={ownersLoading}
            />
          </div>

          {/* Right Column - Message Form and Progress */}
          <div className="space-y-6">
            <MessageForm
              selectedOwnersCount={selectedOwnerIds.length}
              onSendMessage={handleSendMessage}
              isLoading={isSending}
              disabled={isActive}
            />

            <SendingProgress
              isActive={isActive}
              progress={progress}
              results={lastResults}
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8">
          <Card>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                  <Icons.IoChatbubblesOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">
                    Información importante
                  </h3>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    <li>• Los mensajes se envían uno por uno con un intervalo de 2 segundos entre cada envío</li>
                    <li>• Los números de teléfono se formatean automáticamente al formato de WhatsApp (54911...)</li>
                    <li>• Solo se muestran propietarios que tienen número de teléfono registrado</li>
                    <li>• El proceso puede tardar varios minutos dependiendo de la cantidad de destinatarios</li>
                    <li>• Se mostrará un resumen detallado al finalizar el envío</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmación Hermoso */}
      <ConfirmSendModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelSend}
        onConfirm={handleConfirmSend}
        message={pendingMessage}
        selectedOwners={selectedOwners}
        isLoading={isSending}
      />
    </>
  );
};