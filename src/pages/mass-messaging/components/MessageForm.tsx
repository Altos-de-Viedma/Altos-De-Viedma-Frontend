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
    setValue,
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

  // Variables disponibles para insertar
  const availableVariables = [
    {
      key: '{{nombre_propietario}}',
      label: 'Nombre Propietario',
      icon: Icons.IoPersonOutline,
      description: 'Inserta el nombre completo del propietario'
    },
    {
      key: '{{nombre}}',
      label: 'Solo Nombre',
      icon: Icons.IoPersonOutline,
      description: 'Inserta solo el nombre del propietario'
    },
    {
      key: '{{apellido}}',
      label: 'Solo Apellido',
      icon: Icons.IoPersonOutline,
      description: 'Inserta solo el apellido del propietario'
    }
  ];

  const insertVariable = (variable: string) => {
    const currentMessage = messageValue || '';
    const newMessage = currentMessage + variable;
    setValue('message', newMessage, { shouldValidate: true });
  };

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
            {/* Variables de Personalización */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Icons.IoCodeOutline className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">Variables de Personalización:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableVariables.map((variable) => (
                  <Button
                    key={variable.key}
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<variable.icon className="w-3 h-3" />}
                    onPress={() => insertVariable(variable.key)}
                    isDisabled={disabled}
                    className="text-xs"
                  >
                    {variable.label}
                  </Button>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Icons.IoInformationCircleOutline className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Ejemplo de uso:</p>
                    <p className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                      "Buenos días, {`{{nombre_propietario}}`}, nos comunicamos con usted para..."
                    </p>
                    <p className="mt-1 text-blue-600 dark:text-blue-400">
                      Se reemplazará automáticamente: "Buenos días, Juan Pérez, nos comunicamos con usted para..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

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