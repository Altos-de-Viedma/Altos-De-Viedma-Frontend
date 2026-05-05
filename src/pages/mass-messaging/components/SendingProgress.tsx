import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
  Divider
} from '@heroui/react';
import { Icons } from '../../../shared';

interface SendingProgressProps {
  isActive: boolean;
  progress: {
    sent: number;
    total: number;
    currentRecipient: string;
  };
  results?: {
    successful: number;
    failed: number;
  };
}

export const SendingProgress: React.FC<SendingProgressProps> = ({
  isActive,
  progress,
  results
}) => {
  const percentage = progress.total > 0 ? (progress.sent / progress.total) * 100 : 0;
  const isCompleted = progress.sent === progress.total && progress.total > 0;

  if (!isActive && !results) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icons.IoSendOutline className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">
            {isCompleted ? 'Envío Completado' : 'Enviando Mensajes'}
          </h3>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="pt-6">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/60">Progreso</span>
              <span className="font-medium">
                {progress.sent} de {progress.total}
              </span>
            </div>
            <Progress
              value={percentage}
              color={isCompleted ? "success" : "primary"}
              className="w-full"
              size="md"
            />
          </div>

          {/* Current Status */}
          {isActive && progress.currentRecipient && (
            <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Icons.IoTimeOutline className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm">
                Enviando a: <strong>{progress.currentRecipient}</strong>
              </span>
            </div>
          )}

          {/* Results Summary */}
          {results && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <Icons.IoCheckmarkCircleOutline className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium text-success">Exitosos</p>
                  <p className="text-lg font-bold text-success">{results.successful}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                <Icons.IoCloseCircleOutline className="w-5 h-5 text-danger" />
                <div>
                  <p className="text-sm font-medium text-danger">Fallidos</p>
                  <p className="text-lg font-bold text-danger">{results.failed}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Chips */}
          <div className="flex gap-2 flex-wrap">
            {isActive && (
              <Chip color="primary" variant="flat" startContent={<Icons.IoTimeOutline className="w-3 h-3" />}>
                Enviando...
              </Chip>
            )}
            {isCompleted && (
              <Chip color="success" variant="flat" startContent={<Icons.IoCheckmarkCircleOutline className="w-3 h-3" />}>
                Completado
              </Chip>
            )}
            {results && results.failed > 0 && (
              <Chip color="warning" variant="flat" startContent={<Icons.IoCloseCircleOutline className="w-3 h-3" />}>
                Algunos fallos
              </Chip>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};