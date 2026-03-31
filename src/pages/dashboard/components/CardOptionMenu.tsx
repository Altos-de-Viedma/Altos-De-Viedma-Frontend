import { ElementType, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { UI } from '../../../shared';
import { BadgeIcon } from './BadgeIcon';

interface Props {
  title: string;
  route: string;
  Icon: ElementType;
  type?: 'emergencies' | 'packages' | 'visitors' | 'invoices';
}

export const CardOptionMenu = ({ title, Icon, route, type }: Props) => {
  const navigate = useNavigate();
  const [badgeCount, setBadgeCount] = useState(0);

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
        w-full max-w-72 mx-auto
        aspect-[7/6]
        cursor-pointer border-2 transition-all duration-300 ease-in-out
        ${getCardColor()}
        shadow-sm hover:shadow-lg hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        rounded-xl
        btn-hover-lift
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
      <UI.CardBody className="center-flex-col p-3 sm:p-4 h-full overflow-hidden">
        {/* Icon container - perfectly centered */}
        <div className="center-flex mb-2 flex-shrink-0" aria-hidden="true">
          <div className={`${getIconColor()} transform transition-transform duration-200 hover:scale-110`}>
            <BadgeIcon
              Icon={Icon}
              type={type}
              onBadgeCountChange={handleBadgeCountChange}
            />
          </div>
        </div>

        {/* Title - responsive text sizing */}
        <h3 className="text-sm sm:text-base font-semibold text-center text-gray-800 dark:text-gray-200 flex-shrink-0 leading-tight px-1">
          {title}
        </h3>
      </UI.CardBody>
    </UI.Card>
  );
};