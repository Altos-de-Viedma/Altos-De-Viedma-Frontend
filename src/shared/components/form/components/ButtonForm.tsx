import { IconButtonProps } from '../interfaces';
import { UI } from '../../../../shared';


export const ButtonForm: React.FC<IconButtonProps> = ( {
  startContent,
  onClick,
  type = 'button',
  variant = 'flat',
  children,
  ...props
} ) => {
  return (
    <UI.Button
      variant={ variant }
      startContent={ startContent }
      onClick={ onClick }
      type={ type }
      { ...props }
    >
      { children }
    </UI.Button>
  );
};
