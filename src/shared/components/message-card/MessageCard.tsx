import React from 'react';
import { Icons } from '../ui';
import { useThemeStore } from '../../../store';

interface MessageCardProps {
  title: string;
  message: string;
  icon: 'school' | 'information' | 'filter';
  variant?: 'info' | 'warning';
}

export const MessageCard: React.FC<MessageCardProps> = ( { title, message, icon, variant = 'info' } ) => {

  const { darkMode } = useThemeStore();

  const isDark = darkMode === 'dark';

  const getIconColor = () => {
    if ( variant === 'info' ) {
      return isDark ? 'text-blue-400' : 'text-blue-500';
    }
    return isDark ? 'text-yellow-400' : 'text-yellow-500';
  };

  const getBgColor = () => {
    if ( variant === 'info' ) {
      return isDark ? 'bg-blue-900' : 'bg-blue-50';
    }
    return isDark ? 'bg-yellow-900' : 'bg-yellow-50';
  };

  const IconComponent = icon === 'school' ? Icons.IoSchoolOutline :
    icon === 'filter' ? Icons.IoSchoolOutline :
      Icons.IoInformationCircleOutline;

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className={ `${ isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800' } rounded-2xl shadow-lg p-6 max-w-lg w-full transition-all duration-300 hover:shadow-xl` }>
        <div className="flex items-center mb-4">
          <div className={ `${ getBgColor() } rounded-full p-3 mr-4` }>
            <IconComponent className={ `${ getIconColor() } w-6 h-6` } />
          </div>
          <h3 className="text-lg font-semibold">{ title }</h3>
        </div>
        <p className={ `${ isDark ? 'text-gray-300' : 'text-gray-600' } leading-relaxed` }>{ message }</p>
      </div>
    </div>
  );
};