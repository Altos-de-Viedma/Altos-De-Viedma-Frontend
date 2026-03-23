import { ElementType, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { UI } from '../../../shared';
import { useEmergencies } from '../../emergency';
import { usePackages } from '../../package';
import { useVisitors } from '../../visitor';
import { useRealTimeData } from '../../../hooks/useRealTimeData';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';

interface Props {
  Icon: ElementType;
  type?: 'emergencies' | 'packages' | 'visitors';
  onBadgeCountChange?: (count: number) => void;
}

export const BadgeIcon = ({ Icon, type, onBadgeCountChange }: Props) => {
  const { emergencies, refetch: refetchEmergencies } = useEmergencies();
  const { packages, refetch: refetchPackages } = usePackages();
  const { visitors, refetch: refetchVisitors } = useVisitors();
  const [previousCount, setPreviousCount] = useState(0);
  const [hasNewItems, setHasNewItems] = useState(false);
  const { isNotificationSeen } = useSeenNotifications();

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
    if (!type) return 0;

    let activeItems: any[] = [];

    switch (type) {
      case 'emergencies':
        activeItems = emergencies.filter(e => !e.emergencyEnded);
        break;
      case 'packages':
        activeItems = packages.filter(p => !p.received);
        break;
      case 'visitors':
        activeItems = visitors.filter(v => !v.visitCompleted);
        break;
      default:
        return 0;
    }

    // Filter out seen notifications
    const unseenItems = activeItems.filter(item => !isNotificationSeen(type, item.id));
    return unseenItems.length;
  };

  const badgeContent = getBadgeContent();

  // Notify parent component of badge count changes
  useEffect(() => {
    if (onBadgeCountChange) {
      onBadgeCountChange(badgeContent);
    }
  }, [badgeContent, onBadgeCountChange]);

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
                badge: `${hasNewItems ? 'animate-pulse' : ''} shadow-lg font-bold text-white ${
                  type === 'emergencies' ? 'bg-red-600 border-2 border-red-700' :
                  type === 'packages' ? 'bg-blue-600 border-2 border-blue-700' :
                  type === 'visitors' ? 'bg-green-600 border-2 border-green-700' :
                  'bg-primary-600 border-2 border-primary-700'
                }`,
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
    </motion.div>
  );
};