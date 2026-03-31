import { IconContainer, Icons } from '../components';
import { IconContainerProps } from '../components/ui/components/IconContainer';


interface IconProps extends Omit<IconContainerProps, 'children'> {
  icon: keyof typeof Icons;
  size?: number;
}

export const useInputIcon = ( { icon, size = 24, className = '' }: IconProps ) => {
  const IconComponent = Icons[ icon ];

  return (
    <IconContainer className={ className }>
      <IconComponent size={ size } className="text-default-400 pointer-events-none" children={ undefined } />
    </IconContainer>
  );
};
