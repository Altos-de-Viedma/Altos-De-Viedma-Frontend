import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Chip,
  Card,
  CardBody
} from '@heroui/react';
import { Icons } from '../../../shared';
import { IOwnerContact } from '../interfaces';

interface ConfirmSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  selectedOwners: IOwnerContact[];
  isLoading?: boolean;
}

export const ConfirmSendModal: React.FC<ConfirmSendModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  selectedOwners,
  isLoading = false
}) => {
  const messagePreview = message.length > 100 ? `${message.substring(0, 100)}...` : message;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
              <Icons.IoWarningOutline className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirmar Envío de Mensajes</h2>
              <p className="text-sm text-foreground/60 font-normal">
                Esta acción enviará mensajes a múltiples propietarios
              </p>
            </div>
          </div>
        </ModalHeader>

        <Divider />

        <ModalBody className="py-6">
          <div className="space-y-6">
            {/* Resumen del envío */}
            <Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icons.IoPeopleOutline className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-700 dark:text-primary-300">
                      Destinatarios
                    </span>
                  </div>
                  <Chip color="primary" variant="flat" size="lg">
                    {selectedOwners.length} propietarios
                  </Chip>
                </div>
              </CardBody>
            </Card>

            {/* Vista previa del mensaje */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icons.IoChatbubblesOutline className="w-4 h-4 text-foreground/60" />
                <span className="text-sm font-medium text-foreground/80">Vista previa del mensaje:</span>
              </div>
              <Card className="bg-content2/50">
                <CardBody className="p-4">
                  <p className="text-sm text-foreground/80 italic">
                    "{messagePreview}"
                  </p>
                  {message.length > 100 && (
                    <p className="text-xs text-foreground/50 mt-2">
                      Mensaje completo: {message.length} caracteres
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Lista de destinatarios (primeros 5) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icons.IoListOutline className="w-4 h-4 text-foreground/60" />
                <span className="text-sm font-medium text-foreground/80">
                  Destinatarios seleccionados:
                </span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedOwners.slice(0, 5).map((owner) => (
                  <div key={owner.id} className="flex items-center gap-3 p-2 bg-content2/30 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">
                        {owner.name.charAt(0)}{owner.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {owner.name} {owner.lastName}
                      </p>
                      <p className="text-xs text-foreground/60 truncate">
                        {owner.phone}
                      </p>
                    </div>
                  </div>
                ))}
                {selectedOwners.length > 5 && (
                  <div className="text-center py-2">
                    <Chip size="sm" variant="flat">
                      +{selectedOwners.length - 5} más
                    </Chip>
                  </div>
                )}
              </div>
            </div>

            {/* Advertencia */}
            <Card className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <Icons.IoInformationCircleOutline className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-warning-700 dark:text-warning-300">
                      Información importante:
                    </p>
                    <ul className="text-xs text-warning-600 dark:text-warning-400 space-y-1">
                      <li>• Los mensajes se enviarán uno por uno con un intervalo de 2 segundos</li>
                      <li>• El proceso puede tardar varios minutos en completarse</li>
                      <li>• No podrás cancelar el envío una vez iniciado</li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>

        <Divider />

        <ModalFooter className="justify-center gap-4 py-6">
          <Button
            color="default"
            variant="flat"
            onPress={onClose}
            size="lg"
            className="min-w-[140px]"
            isDisabled={isLoading}
            startContent={<Icons.IoCloseOutline className="w-4 h-4" />}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={onConfirm}
            size="lg"
            className="min-w-[140px] bg-primary-600 text-white font-semibold"
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none'
            }}
            isLoading={isLoading}
            endContent={!isLoading ? <Icons.IoSendOutline className="w-4 h-4" /> : undefined}
          >
            {isLoading ? 'Enviando...' : 'Confirmar Envío'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};