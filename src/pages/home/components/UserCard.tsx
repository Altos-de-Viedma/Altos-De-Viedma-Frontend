import { motion } from 'framer-motion';
import { useAuthStore } from '../../auth';

export const UserCard = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-fit mx-auto mb-8"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-medium text-foreground/80"
        >
          Hola, <span className="text-primary-600 dark:text-primary-400 font-semibold">{user?.name}</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-foreground/50 mt-1"
        >
          ¿Qué necesitas hacer hoy?
        </motion.p>
      </div>
    </motion.div>
  );
};
