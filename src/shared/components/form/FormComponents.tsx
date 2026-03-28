import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  subtitle,
  className = '',
  onSubmit,
}) => {
  return (
    <motion.div
      className={`w-full wide-container px-4 sm:px-6 lg:px-8 xl:px-12 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {(title || subtitle) && (
        <motion.div
          className="text-center mb-6 sm:mb-8 lg:mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {title && (
            <h2 className="responsive-text-xl sm:responsive-text-2xl lg:text-3xl xl:text-4xl font-bold text-gradient mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-foreground/70 responsive-text-base lg:text-lg xl:text-xl max-w-4xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      <motion.form
        className="glass-effect border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 shadow-large w-full max-w-none"
        onSubmit={onSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {children}
      </motion.form>
    </motion.div>
  );
};

export const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <motion.div
      className={`mb-4 sm:mb-6 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {(title || description) && (
        <div className="mb-3 sm:mb-4 text-center sm:text-left">
          {title && (
            <h3 className="responsive-text-base font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="responsive-text-sm text-foreground/60">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-3 sm:space-y-4 w-full">
        {children}
      </div>
    </motion.div>
  );
};

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = '',
  align = 'right',
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end sm:justify-end',
    between: 'justify-between',
  };

  return (
    <motion.div
      className={`flex flex-col sm:flex-row ${alignmentClasses[align]} gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced form field wrapper with better animations and styling
interface FormFieldProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// Form grid for responsive layouts
interface FormGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({
  children,
  columns = 1,
  className = '',
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
};