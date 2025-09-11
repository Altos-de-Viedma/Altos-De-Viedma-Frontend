import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UI, Icons } from '../../../shared';
import { useAuthStore } from '../../../pages';
import { IconContainer } from '../ui/components/icons/IconContainer';



export const NavBarComponent = () => {

  const { logoutUser } = useAuthStore();
  const navigate = useNavigate();


  const onLogout = () => {
    logoutUser();
    toast.success( 'Sesión cerrada correctamente' );
    navigate( '/' );
  };

  const handleNavigate = ( route: string ) => {
    navigate( route );
  };

  return (
    <UI.Navbar isBlurred maxWidth="full">
      <UI.NavbarContent justify="start">
        <UI.NavbarItem>
          {/* <UI.Switch
            defaultSelected
            size="sm"
            color="primary"
            isSelected={ darkMode === 'dark' }
            onChange={ changeTheme }
            thumbIcon={ ( { isSelected, className } ) =>
              isSelected ? <Icons.IoMoonOutline className={ className } /> : <Icons.IoSunnyOutline className={ className } />
            }
          /> */}
        </UI.NavbarItem>
      </UI.NavbarContent>

      <UI.NavbarContent justify="center">
        <UI.NavbarBrand className="flex flex-col items-center cursor-pointer justify-center pt-0 md:pt-6" onClick={ () => handleNavigate( '/home' ) }>
          <IconContainer children={ <Icons.IoHomeOutline size={ 24 } /> } className="hidden md:block" />
          {/* <img src="https://i.imgur.com/pqcBC6D.jpeg" width="160" height="160" /> */}
          <p className="font-bold text-inherit text-2xl mt-[4px]">Altos de Viedma</p>
        </UI.NavbarBrand>
      </UI.NavbarContent>

      <UI.NavbarContent justify="end">
        {/* <UI.NavbarItem className="flex">
          <UI.Dropdown>
            <UI.Badge content="5" color="primary">
              <UI.DropdownTrigger>
                <UI.Button radius="full" isIconOnly aria-label="Notifications" variant="light">
                  <Icons.IoNotificationsOutline size={ 24 } />
                </UI.Button>
              </UI.DropdownTrigger>
            </UI.Badge>
            <UI.DropdownMenu aria-label="Static Actions">
              <UI.DropdownItem key="user">
                <div className="flex flex-col">
                  <li>Tomassini Leandro</li>
                  <li>ltomassini@argentumconsulting.com.ar</li>
                </div>
              </UI.DropdownItem>
            </UI.DropdownMenu>
          </UI.Dropdown>
        </UI.NavbarItem> */}
        <UI.NavbarItem className="flex">
          <UI.Dropdown>
            <UI.DropdownTrigger>
              <UI.Button aria-label="Menú" startContent={ <Icons.IoMenuOutline size={ 24 } /> } variant="light">
                Menú
              </UI.Button>
            </UI.DropdownTrigger>
            <UI.DropdownMenu aria-label="Static Actions">
              <UI.DropdownItem key="logout" className="text-danger" color="danger" onPress={ onLogout }>
                Cerrar sesión
              </UI.DropdownItem>
            </UI.DropdownMenu>
          </UI.Dropdown>
        </UI.NavbarItem>
      </UI.NavbarContent>
    </UI.Navbar>
  );
};