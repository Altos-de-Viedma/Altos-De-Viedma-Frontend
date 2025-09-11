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
      startContent={ <Icons.IoArrowBackOutline size={ 24 } /> }
      variant="light"
      className="font-bold text-xl"
      color="danger"
      onPress={ navigateTo }
    >
      Volver
    </UI.Button>
  );
};
