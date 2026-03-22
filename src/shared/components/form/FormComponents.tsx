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
      className={`w-full max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {(title || subtitle) && (
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-foreground/70 text-lg">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      <motion.form
        className="glass-effect border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 md:p-8 shadow-large"
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
      className={`mb-6 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-foreground/60">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
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
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <motion.div
      className={`flex ${alignmentClasses[align]} gap-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 ${className}`}
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