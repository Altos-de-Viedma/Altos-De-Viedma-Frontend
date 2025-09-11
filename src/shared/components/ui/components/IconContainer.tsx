import React from 'react';

export interface IconContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const IconFormContainer: React.FC<IconContainerProps> = ( { children, className = '' } ) => {
  return <div className={ `icon-container ${ className }` }>{ children }</div>;
};
