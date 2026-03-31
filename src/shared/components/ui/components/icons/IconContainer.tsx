import React from 'react';
import { ReactNode } from 'react';

import { useThemeStore } from '../../../../../store';



interface IconContainerProps {
  children: ReactNode;
  size?: number;
  className?: string;
}

export const IconContainer = ( { children, size = 24, className }: IconContainerProps ) => {
  const { darkMode } = useThemeStore();

  return (
    <div
      className={ `flex items-center justify-center rounded-full p-2 ${ darkMode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        } ${ className }` }
    >
      { React.cloneElement( children as React.ReactElement, {
        size,
        className: `${ darkMode === 'dark' ? 'text-gray-400' : 'text-gray-600' } ${ ( children as React.ReactElement ).props.className || ''
          }`,
      } ) }
    </div>
  );
};
