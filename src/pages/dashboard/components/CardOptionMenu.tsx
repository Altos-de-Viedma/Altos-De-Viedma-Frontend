import { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { UI } from '../../../shared';
import { BadgeIcon } from './BadgeIcon';

interface Props {
  title: string;
  route: string;
  Icon: ElementType;
  type?: 'emergencies' | 'packages' | 'visitors';
}

export const CardOptionMenu = ({ title, Icon, route, type }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const getCardColor = () => {
    switch (type) {
      case 'emergencies':
        return 'from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40';
      case 'packages':
        return 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40';
      case 'visitors':
        return 'from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40';
      default:
        return 'from-primary-500/10 to-primary-600/5 border-primary-500/20 hover:border-primary-500/40';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'emergencies':
        return 'text-red-500';
      case 'packages':
        return 'text-blue-500';
      case 'visitors':
        return 'text-green-500';
      default:
        return 'text-primary-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <UI.Card
        isPressable
        className={`
          w-44 h-44 sm:w-48 sm:h-48 lg:w-52 lg:h-52
          cursor-pointer border-2 transition-all duration-300 ease-bounce-apple
          bg-gradient-to-br ${getCardColor()}
          shadow-soft hover:shadow-large
          backdrop-blur-sm
          relative overflow-hidden
        `}
        onPress={() => handleNavigate(route)}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100"
          initial={false}
        />

        <UI.CardBody className="flex flex-col justify-center items-center p-6 relative z-10">
          <motion.div
            className="mb-4"
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className={`${getIconColor()} transition-colors duration-300`}>
              <BadgeIcon Icon={Icon} type={type} />
            </div>
          </motion.div>

          <motion.h3
            className="font-semibold text-lg text-center text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {title}
          </motion.h3>
        </UI.CardBody>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 w-0 group-hover:w-full transition-all duration-500 ease-out"
          initial={{ width: 0 }}
        />
      </UI.Card>
    </motion.div>
  );
};