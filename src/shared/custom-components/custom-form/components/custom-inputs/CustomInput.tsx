
import { motion } from 'framer-motion';
import { UI } from '../../../../components';
import { GenericInputProps } from './interfaces';

export const CustomInput: React.FC<GenericInputProps> = ({
  type,
  label,
  name,
  register,
  errors,
  defaultValue = '',
  variant = 'bordered',
  size = 'lg',
  className = '',
  placeholder,
  startContent,
  endContent,
  description,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
}) => {
  const hasError = !!errors[name]?.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full max-w-md mx-auto sm:max-w-none ${className}`}
    >
      <UI.Input
        type={type}
        label={label}
        placeholder={placeholder}
        description={description}
        variant={variant}
        size={size}
        id={name}
        {...register(name)}
        defaultValue={defaultValue}
        isInvalid={hasError}
        errorMessage={errors[name]?.message as string}
        isRequired={isRequired}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        startContent={startContent}
        endContent={endContent}
        classNames={{
          base: 'w-full',
          mainWrapper: 'w-full',
          inputWrapper: [
            'glass-effect',
            'border',
            'border-gray-200/50',
            'dark:border-gray-700/50',
            'hover:border-primary-500/50',
            'focus-within:border-primary-500',
            'transition-all',
            'duration-300',
            'shadow-soft',
            'hover:shadow-medium',
            'focus-within:shadow-glow',
            'min-h-[3rem] sm:min-h-[3.5rem]',
            'px-3 sm:px-4',
            'rounded-lg sm:rounded-xl',
            hasError && 'border-danger-500 hover:border-danger-500 focus-within:border-danger-500',
          ].filter(Boolean).join(' '),
          input: [
            'text-foreground',
            'placeholder:text-foreground/50',
            'bg-transparent',
            'responsive-text-sm sm:responsive-text-base',
            'py-2 sm:py-3',
            'text-center sm:text-left'
          ].join(' '),
          label: [
            'text-foreground/70',
            'font-medium',
            'responsive-text-sm',
            'text-center sm:text-left',
            hasError ? 'text-danger-500' : 'group-focus-within:text-primary-500',
            'transition-colors',
            'duration-200',
          ].filter(Boolean).join(' '),
          description: 'text-foreground/60 responsive-text-xs text-center sm:text-left mt-1',
          errorMessage: 'text-danger-500 responsive-text-xs font-medium text-center sm:text-left mt-1',
        }}
      />
    </motion.div>
  );
};