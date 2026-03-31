import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScreenSize, useIsMobile } from '../../../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface ResponsiveGridProps {
  children: ReactNode;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface ResponsiveStackProps {
  children: ReactNode;
  direction?: {
    xs?: 'row' | 'column';
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
    xl?: 'row' | 'column';
    '2xl'?: 'row' | 'column';
  };
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

interface MobileDrawerProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'left' | 'right' | 'bottom';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-4 sm:px-6 lg:px-8',
    xl: 'px-4 sm:px-6 lg:px-8 xl:px-12',
  };

  return (
    <div className={`w-full mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className = '',
}) => {
  const { screenSize } = useScreenSize();

  const getColumns = () => {
    const orderedBreakpoints = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
    const currentIndex = orderedBreakpoints.indexOf(screenSize);

    for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
      const breakpoint = orderedBreakpoints[i];
      if (columns[breakpoint] !== undefined) {
        return columns[breakpoint];
      }
    }
    return 1;
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const currentColumns = getColumns();

  return (
    <div
      className={`grid ${gapClasses[gap]} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${currentColumns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = { xs: 'column', md: 'row' },
  spacing = 'md',
  align = 'start',
  justify = 'start',
  className = '',
}) => {
  const { screenSize } = useScreenSize();

  const getDirection = () => {
    const orderedBreakpoints = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
    const currentIndex = orderedBreakpoints.indexOf(screenSize);

    for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
      const breakpoint = orderedBreakpoints[i];
      if (direction[breakpoint] !== undefined) {
        return direction[breakpoint];
      }
    }
    return 'column';
  };

  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const currentDirection = getDirection();
  const flexDirection = currentDirection === 'row' ? 'flex-row' : 'flex-col';

  return (
    <div
      className={`flex ${flexDirection} ${spacingClasses[spacing]} ${alignClasses[align]} ${justifyClasses[justify]} ${className}`}
    >
      {children}
    </div>
  );
};

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  children,
  isOpen,
  onClose,
  title,
  position = 'left',
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const positionClasses = {
    left: 'left-0 top-0 h-full w-80 max-w-[80vw]',
    right: 'right-0 top-0 h-full w-80 max-w-[80vw]',
    bottom: 'bottom-0 left-0 right-0 h-auto max-h-[80vh]',
  };

  const slideVariants = {
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0 },
    },
    right: {
      hidden: { x: '100%' },
      visible: { x: 0 },
    },
    bottom: {
      hidden: { y: '100%' },
      visible: { y: 0 },
    },
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <motion.div
        className={`fixed ${positionClasses[position]} glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 ${
          position === 'bottom' ? 'rounded-t-2xl' : 'rounded-r-2xl'
        }`}
        variants={slideVariants[position]}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  );
};

// Responsive text component
interface ResponsiveTextProps {
  children: ReactNode;
  size?: {
    xs?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    sm?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    md?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    lg?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    xl?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
    '2xl'?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  };
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = { xs: 'base', md: 'lg' },
  className = '',
  as: Component = 'p',
}) => {
  const { screenSize } = useScreenSize();

  const getSize = () => {
    const orderedBreakpoints = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const;
    const currentIndex = orderedBreakpoints.indexOf(screenSize);

    for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
      const breakpoint = orderedBreakpoints[i];
      if (size[breakpoint] !== undefined) {
        return size[breakpoint];
      }
    }
    return 'base';
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  };

  const currentSize = getSize();

  return (
    <Component className={`${sizeClasses[currentSize]} ${className}`}>
      {children}
    </Component>
  );
};