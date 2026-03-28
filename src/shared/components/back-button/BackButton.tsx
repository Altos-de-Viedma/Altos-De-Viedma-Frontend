import { useRedirect } from '../../helpers';
import { Icons, UI } from '../ui';



interface Props {
  url: string;
}

export const BackButton = ( { url }: Props ) => {
  const { redirectTo } = useRedirect();

  const navigateTo = () => {
    redirectTo( url );
  };

  return (
    <UI.Button
      startContent={ <Icons.IoArrowBackOutline size={ 20 } className="sm:w-6 sm:h-6" /> }
      variant="light"
      className="font-bold responsive-text-base sm:responsive-text-lg btn-hover-lift min-h-[3rem] sm:min-h-[3.5rem] px-4 sm:px-6"
      color="danger"
      onPress={ navigateTo }
      size="lg"
    >
      <span className="hidden sm:inline">Volver</span>
      <span className="sm:hidden">Atrás</span>
    </UI.Button>
  );
};
