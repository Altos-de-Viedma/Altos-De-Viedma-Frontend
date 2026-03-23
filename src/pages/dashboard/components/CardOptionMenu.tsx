import { ElementType, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { UI } from '../../../shared';
import { BadgeIcon } from './BadgeIcon';
import { useNotificationSound } from '../../../hooks/useNotificationSound';
import { useSeenNotifications } from '../../../hooks/useSeenNotifications';
import { useEmergencies } from '../../emergency';
import { usePackages } from '../../package';
import { useVisitors } from '../../visitor';

interface Props {
  title: string;
  route: string;
  Icon: ElementType;
  type?: 'emergencies' | 'packages' | 'visitors';
}

export const CardOptionMenu = ({ title, Icon, route, type }: Props) => {
  const navigate = useNavigate();
  const [badgeCount, setBadgeCount] = useState(0);

  // Data hooks
  const { emergencies } = useEmergencies();
  const { packages } = usePackages();
  const { visitors } = useVisitors();

  // Seen notifications hook
  const { markAsSeen, isNotificationSeen } = useSeenNotifications();

  // Notification sound hook
  const { stopSound } = useNotificationSound({
    isActive: badgeCount > 0,
    type: type || 'packages', // Default fallback
  });

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const handleBadgeCountChange = useCallback((count: number) => {
    setBadgeCount(count);
  }, []);

  const getCardColor = () => {
    // Solo mostrar colores si hay notificaciones
    if (badgeCount > 0) {
      switch (type) {
        case 'emergencies':
          return 'border-red-300 hover:border-red-400 bg-red-50 hover:bg-red-100 dark:border-red-600 dark:hover:border-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/30';
        case 'packages':
          return 'border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:hover:border-blue-500 dark:bg-blue-900/20 dark:hover:bg-blue-900/30';
        case 'visitors':
          return 'border-green-300 hover:border-green-400 bg-green-50 hover:bg-green-100 dark:border-green-600 dark:hover:border-green-500 dark:bg-green-900/20 dark:hover:bg-green-900/30';
        default:
          return 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-900 dark:hover:bg-gray-800';
      }
    }
    // Sin notificaciones: blanco y negro según el tema
    return 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-900 dark:hover:bg-gray-800';
  };

  const getIconColor = () => {
    // Solo mostrar colores si hay notificaciones
    if (badgeCount > 0) {
      switch (type) {
        case 'emergencies':
          return 'text-red-600 dark:text-red-400';
        case 'packages':
          return 'text-blue-600 dark:text-blue-400';
        case 'visitors':
          return 'text-green-600 dark:text-green-400';
        default:
          return 'text-gray-600 dark:text-gray-300';
      }
    }
    // Sin notificaciones: blanco y negro según el tema
    return 'text-gray-800 dark:text-gray-200';
  };

  return (
    <UI.Card
      isPressable
      className={`
        w-44 h-44 sm:w-48 sm:h-48 lg:w-44 lg:h-44 xl:w-40 xl:h-40
        cursor-pointer border-2 transition-colors duration-200
        ${getCardColor()}
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        overflow-hidden
      `}
      onPress={() => handleNavigate(route)}
      role="button"
      tabIndex={0}
      aria-label={`Navegar a ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNavigate(route);
        }
      }}
    >
      <UI.CardBody className="flex flex-col justify-center items-center p-6 overflow-hidden">
        <div className="mb-4 flex-shrink-0" aria-hidden="true">
          <div className={`${getIconColor()}`}>
            <BadgeIcon Icon={Icon} type={type} onBadgeCountChange={handleBadgeCountChange} />
          </div>
        </div>

        <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-200 flex-shrink-0">
          {title}
        </h3>
      </UI.CardBody>
    </UI.Card>
  );
};