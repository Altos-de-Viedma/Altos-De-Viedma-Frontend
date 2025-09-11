import { IconContainer, Icons, UI } from '../../../shared';
import { useAuthStore } from '../../auth';

export const UserCard = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  return (
    <UI.Card className="md:w-1/4 p-4 shadow-md rounded-lg bg-white mt-2">
      <UI.CardHeader className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <IconContainer children={ <Icons.IoIdCardOutline size={ 24 } /> } />
          <h1 className="font-bold text-xl">{ user?.username }</h1>
        </div>
        <h2 className="text-lg">{ user?.lastName }, { user?.name }</h2>

        <div className="flex items-center space-x-2 mt-2">
          { user?.roles.includes( 'admin' ) && (
            <UI.Chip startContent={ <IconContainer children={ <Icons.IoShieldHalfOutline size={ 24 } /> } /> }>
              Administrador
            </UI.Chip>
          ) }

          { user?.roles.includes( 'security' ) && (
            <UI.Chip startContent={ <IconContainer children={ <Icons.IoShieldOutline size={ 24 } /> } /> }>
              Seguridad
            </UI.Chip>
          ) }
        </div>
      </UI.CardHeader>
    </UI.Card>
  );
};
