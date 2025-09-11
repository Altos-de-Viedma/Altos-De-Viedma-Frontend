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

export const CardOptionMenu = ( { title, Icon, route, type }: Props ) => {
  
  const navigate = useNavigate();

  const handleNavigate = ( route: string ) => {
    navigate( route );
  };

  return (
    <UI.Card
      isPressable
      className="w-40 h-40 m-2 cursor-pointer"
      onPress={ () => handleNavigate( route ) }
    >
      <UI.CardBody className="flex justify-center items-center">
        <BadgeIcon Icon={ Icon } type={ type } />
      </UI.CardBody>

      <UI.CardFooter className="font-bold flex justify-center">
        { title }
      </UI.CardFooter>
    </UI.Card>
  );
};