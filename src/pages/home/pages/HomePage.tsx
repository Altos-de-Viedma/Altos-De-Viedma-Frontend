import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { CardOptionMenu } from '../../dashboard/components';
import { cardOptions } from '../../dashboard/helpers';
import { CheckAuthStatus } from '../../../shared/helpers';
import { useAuthStore } from '../../auth';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  const hasOnlyUserRole = user?.roles?.length === 1 && user?.roles?.includes('user');

  const filteredCardOptions = cardOptions.filter((option) =>
    (option.title !== 'Usuarios' || user?.roles?.includes('admin')) &&
    (option.title !== 'Propiedades' || hasOnlyUserRole || user?.roles?.includes('admin') || user?.roles?.includes('security'))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <CheckAuthStatus
      loadingComponent={
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="loading-dots text-primary-500">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-foreground/60 font-medium">Cargando...</p>
          </motion.div>
        </div>
      }
      unauthenticatedComponent={<Navigate to="/ingresar" replace />}
    >
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background via-background to-primary-50/30 dark:to-primary-950/30"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Content */}
        <motion.div
          className="container mx-auto px-4 py-12"
          variants={itemVariants}
        >
          {/* Navigation Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            variants={containerVariants}
          >
            {filteredCardOptions.map((option, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CardOptionMenu
                  title={option.title}
                  Icon={option.Icon}
                  route={option.route}
                  type={option.type}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </CheckAuthStatus>
  );
};