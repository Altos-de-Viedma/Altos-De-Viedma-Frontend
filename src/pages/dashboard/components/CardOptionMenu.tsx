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
        return 'border-red-200 hover:border-red-300 bg-red-50/50 hover:bg-red-50';
      case 'packages':
        return 'border-blue-200 hover:border-blue-300 bg-blue-50/50 hover:bg-blue-50';
      case 'visitors':
        return 'border-green-200 hover:border-green-300 bg-green-50/50 hover:bg-green-50';
      default:
        return 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'emergencies':
        return 'text-red-600';
      case 'packages':
        return 'text-blue-600';
      case 'visitors':
        return 'text-green-600';
      default:
        return 'text-gray-600';
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

        <h3 className="font-semibold text-lg text-center text-foreground">
          {title}
        </h3>
      </UI.CardBody>
    </UI.Card>
  );
};