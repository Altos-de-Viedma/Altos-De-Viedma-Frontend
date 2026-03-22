import { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';

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
        return 'border-red-300 hover:border-red-400 bg-red-50 hover:bg-red-100 dark:border-red-600 dark:hover:border-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/30';
      case 'packages':
        return 'border-blue-300 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:hover:border-blue-500 dark:bg-blue-900/20 dark:hover:bg-blue-900/30';
      case 'visitors':
        return 'border-green-300 hover:border-green-400 bg-green-50 hover:bg-green-100 dark:border-green-600 dark:hover:border-green-500 dark:bg-green-900/20 dark:hover:bg-green-900/30';
      default:
        return 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-800/50 dark:hover:bg-gray-700/50';
    }
  };

  const getIconColor = () => {
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
  };

  return (
    <UI.Card
      isPressable
      className={`
        w-44 h-44 sm:w-48 sm:h-48 lg:w-52 lg:h-52
        cursor-pointer border-2 transition-colors duration-200
        ${getCardColor()}
        shadow-sm hover:shadow-md
      `}
      onPress={() => handleNavigate(route)}
    >
      <UI.CardBody className="flex flex-col justify-center items-center p-6">
        <div className="mb-4">
          <div className={`${getIconColor()}`}>
            <BadgeIcon Icon={Icon} type={type} />
          </div>
        </div>

        <h3 className="font-semibold text-lg text-center text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      </UI.CardBody>
    </UI.Card>
  );
};