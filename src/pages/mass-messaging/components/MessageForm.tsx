import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Textarea,
  Button,
  Chip,
  Divider
} from '@heroui/react';
import { Icons } from '../../../shared';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { massMessageSchema, MassMessageFormData } from '../validators';

interface MessageFormProps {
  selectedOwnersCount: number;
  onSendMessage: (data: MassMessageFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  selectedOwnersCount,
  onSendMessage,
  isLoading = false,
  disabled = false
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<MassMessageFormData>({
    resolver: zodResolver(massMessageSchema),
    defaultValues: {
      message: ''
    },
    mode: 'onChange'
  });

  const messageValue = watch('message');
  const messageLength = messageValue?.length || 0;
  const maxLength = 1000;

  const onSubmit = (data: MassMessageFormData) => {
    onSendMessage(data);
  };

  const canSend = messageLength >= 10 && selectedOwnersCount > 0 && !isLoading && !disabled;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icons.IoChatbubblesOutline className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Mensaje</h3>
        </div>
      </CardHeader>

      <Divider />

      <CardBody className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Mensaje a enviar"
                  placeholder="Escriba aquí el mensaje que desea enviar a los propietarios seleccionados..."
                  minRows={4}
                  maxRows={8}
                  isInvalid={!!errors.message}
                  errorMessage={errors.message?.message}
                  description={`${messageLength}/${maxLength} caracteres`}
                  classNames={{
                    input: "resize-none",
                    inputWrapper: "min-h-[120px]"
                  }}
                  disabled={disabled}
                />
              )}
            />

            {/* BOTÓN DE ENVIAR */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              endContent={<Icons.IoSendOutline className="w-5 h-5" />}
              isLoading={isLoading}
              isDisabled={!canSend}
              className="w-full h-14 text-lg font-semibold bg-primary text-white"
              style={{
                backgroundColor: canSend ? '#0066cc' : '#cccccc',
                color: 'white',
                opacity: canSend ? 1 : 0.6
              }}
            >
              {isLoading
                ? 'Enviando mensajes...'
                : selectedOwnersCount > 0
                  ? `ENVIAR MENSAJE A ${selectedOwnersCount} PROPIETARIOS`
                  : 'SELECCIONA PROPIETARIOS PARA ENVIAR'
              }
            </Button>

            {/* Información */}
            <div className="flex justify-between items-center text-sm bg-content2/50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Icons.IoPeopleOutline className="w-4 h-4 text-foreground/60" />
                <span className="text-foreground/60">
                  Destinatarios seleccionados:
                </span>
                <Chip
                  size="sm"
                  color={selectedOwnersCount > 0 ? "success" : "default"}
                  variant="flat"
                >
                  {selectedOwnersCount}
                </Chip>
              </div>

              <Chip
                size="sm"
                color={messageLength > maxLength * 0.9 ? "warning" : "default"}
                variant="flat"
              >
                {messageLength}/{maxLength}
              </Chip>
            </div>
          </div>

          {/* Advertencias */}
          {selectedOwnersCount === 0 && (
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
              <p className="text-warning-700 dark:text-warning-300 text-sm font-medium">
                ⚠️ Debe seleccionar al menos un propietario para enviar el mensaje.
              </p>
            </div>
          )}

          {messageLength > 0 && messageLength < 10 && (
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
              <p className="text-warning-700 dark:text-warning-300 text-sm font-medium">
                ⚠️ El mensaje debe tener al menos 10 caracteres.
              </p>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
};