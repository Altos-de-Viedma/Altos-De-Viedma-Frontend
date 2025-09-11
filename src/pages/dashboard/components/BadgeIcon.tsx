import { ElementType, useEffect } from 'react';

import { UI } from '../../../shared';
import { useEmergencies } from '../../emergency';
import { usePackages } from '../../package';
import { useVisitors } from '../../visitor';

interface Props {
  Icon: ElementType;
  type?: 'emergencies' | 'packages' | 'visitors';
}

export const BadgeIcon = ( { Icon, type }: Props ) => {

  const { emergencies, refetch: refetchEmergencies } = useEmergencies();
  const { packages, refetch: refetchPackages } = usePackages();
  const { visitors, refetch: refetchVisitors } = useVisitors();

  useEffect( () => {
    
    const interval = setInterval( () => {
      if ( type === 'emergencies' ) refetchEmergencies();
      if ( type === 'packages' ) refetchPackages();
      if ( type === 'visitors' ) refetchVisitors();
    }, 5000 );

    return () => clearInterval( interval );
  }, [ type, refetchEmergencies, refetchPackages, refetchVisitors ] );

  const getBadgeContent = () => {
    switch ( type ) {
      case 'emergencies':
        return emergencies.filter( e => !e.emergencyEnded ).length;
      case 'packages':
        return packages.filter( p => !p.received ).length;
      case 'visitors':
        return visitors.filter( v => !v.visitCompleted ).length;
      default:
        return 0;
    }
  };

  const badgeContent = getBadgeContent();

  return (
    <>
      { type && badgeContent > 0 ? (
        <UI.Badge content={ badgeContent.toString() } color="primary" size="lg">
          <Icon size={ 60 } />
        </UI.Badge>
      ) : (
        <Icon size={ 60 } />
      ) }
    </>
  );
};