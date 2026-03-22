import { ElementType, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { UI } from '../../../shared';
import { useEmergencies } from '../../emergency';
import { usePackages } from '../../package';
import { useVisitors } from '../../visitor';
import { useRealTimeData } from '../../../hooks/useRealTimeData';

interface Props {
  Icon: ElementType;
  type?: 'emergencies' | 'packages' | 'visitors';
}

export const BadgeIcon = ({ Icon, type }: Props) => {
  const { emergencies, refetch: refetchEmergencies } = useEmergencies();
  const { packages, refetch: refetchPackages } = usePackages();
  const { visitors, refetch: refetchVisitors } = useVisitors();
  const [previousCount, setPreviousCount] = useState(0);
  const [hasNewItems, setHasNewItems] = useState(false);

  // Real-time data connection
  const realTimeData = useRealTimeData({
    enabled: true,
  });

  // Refresh data periodically as fallback
  useEffect(() => {
    const interval = setInterval(() => {
      if (type === 'emergencies') refetchEmergencies();
      if (type === 'packages') refetchPackages();
      if (type === 'visitors') refetchVisitors();
    }, 30000); // Reduced from 5s to 30s since we have real-time updates

    return () => clearInterval(interval);
  }, [type, refetchEmergencies, refetchPackages, refetchVisitors]);

  const getBadgeContent = () => {
    switch (type) {
      case 'emergencies':
        return emergencies.filter(e => !e.emergencyEnded).length;
      case 'packages':
        return packages.filter(p => !p.received).length;
      case 'visitors':
        return visitors.filter(v => !v.visitCompleted).length;
      default:
        return 0;
    }
  };

  const badgeContent = getBadgeContent();

  // Detect new items for animation
  useEffect(() => {
    if (badgeContent > previousCount && previousCount > 0) {
      setHasNewItems(true);
      const timer = setTimeout(() => setHasNewItems(false), 2000);
      return () => clearTimeout(timer);
    }
    setPreviousCount(badgeContent);
  }, [badgeContent, previousCount]);

  const getBadgeColor = () => {
    switch (type) {
      case 'emergencies':
        return 'danger';
      case 'packages':
        return 'primary';
      case 'visitors':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <AnimatePresence>
        {type && badgeContent > 0 ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: hasNewItems ? [1, 1.2, 1] : 1,
              opacity: 1
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: hasNewItems ? 0.6 : 0.3,
              ease: 'easeOut'
            }}
          >
            <UI.Badge
              content={badgeContent.toString()}
              color={getBadgeColor() as any}
              size="lg"
              classNames={{
                badge: `${hasNewItems ? 'animate-pulse' : ''} shadow-medium font-bold`,
              }}
            >
              <motion.div
                animate={hasNewItems ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Icon size={60} />
              </motion.div>
            </UI.Badge>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon size={60} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time connection indicator */}
      {type && (
        <motion.div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
            realTimeData.isConnected
              ? 'bg-green-500'
              : 'bg-gray-400'
          }`}
          animate={{
            scale: realTimeData.isConnected ? [1, 1.2, 1] : 1,
            opacity: realTimeData.isConnected ? [0.7, 1, 0.7] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: realTimeData.isConnected ? Infinity : 0,
            ease: 'easeInOut',
          }}
          title={
            realTimeData.isConnected
              ? 'Conectado en tiempo real'
              : 'Sin conexión en tiempo real'
          }
        />
      )}
    </motion.div>
  );
};