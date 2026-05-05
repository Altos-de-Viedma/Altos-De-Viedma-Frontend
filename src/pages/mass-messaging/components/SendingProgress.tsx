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
}

export const SendingProgress: React.FC<SendingProgressProps> = ({
  isActive,
  progress
}) => {
  const percentage = progress.total > 0 ? (progress.sent / progress.total) * 100 : 0;

  // Only show when actively sending
  if (!isActive) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icons.IoSendOutline className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Enviando Mensajes</h3>
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
              color="primary"
              className="w-full"
              size="md"
            />
          </div>

          {/* Current Status */}
          {progress.currentRecipient && (
            <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Icons.IoTimeOutline className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm">
                Enviando a: <strong>{progress.currentRecipient}</strong>
              </span>
            </div>
          )}

          {/* Status Chip */}
          <div className="flex gap-2 flex-wrap">
            <Chip color="primary" variant="flat" startContent={<Icons.IoTimeOutline className="w-3 h-3" />}>
              Enviando...
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};