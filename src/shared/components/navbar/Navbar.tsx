import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UI, Icons } from '../../../shared';
import { useAuthStore } from '../../../pages';
import { useThemeStore } from '../../../store';

export const NavBarComponent = () => {
  const { logoutUser, user } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const onLogout = () => {
    logoutUser();
    toast.success('Sesión cerrada correctamente', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate('/');
  };

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const handleThemeToggle = () => {
    toggleDarkMode();
    toast.info(
      `Tema ${darkMode === 'dark' ? 'claro' : 'oscuro'} activado`,
      {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      }
    );
  };

  return (
    <UI.Navbar
      isBlurred
      maxWidth="full"
      className="bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm"
      height="4rem"
    >
      <UI.NavbarContent justify="start">
        <UI.NavbarItem className="flex items-center gap-3">
          {/* Theme Toggle */}
          <UI.Switch
            size="sm"
            color="primary"
            isSelected={darkMode === 'dark'}
            onChange={handleThemeToggle}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <Icons.IoMoonOutline className={`${className} text-primary-500`} />
              ) : (
                <Icons.IoSunnyOutline className={`${className} text-warning-500`} />
              )
            }
            classNames={{
              wrapper: 'group-data-[selected=true]:bg-primary-500',
              thumb: 'group-data-[selected=true]:bg-white',
            }}
          />

          {/* Quick Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <UI.Button
              variant="light"
              size="sm"
              startContent={<Icons.IoHomeOutline size={18} />}
              onPress={() => handleNavigate('/home')}
              className="text-foreground/70 hover:text-foreground"
            >
              Inicio
            </UI.Button>

            <UI.Button
              variant="light"
              size="sm"
              startContent={<Icons.IoAlertCircleOutline size={18} />}
              onPress={() => handleNavigate('/emergencias')}
              className="text-foreground/70 hover:text-foreground"
            >
              Emergencias
            </UI.Button>
          </div>
        </UI.NavbarItem>
      </UI.NavbarContent>

      <UI.NavbarContent justify="center">
        <UI.NavbarBrand
          className="flex items-center cursor-pointer justify-center"
          onClick={() => handleNavigate('/home')}
        >
          <h1 className="font-semibold text-lg text-foreground/80 hover:text-foreground">
            Altos de Viedma
          </h1>
        </UI.NavbarBrand>
      </UI.NavbarContent>

      <UI.NavbarContent justify="end">
        {/* User Info - Hidden on mobile */}
        {user && (
          <UI.NavbarItem className="hidden md:flex">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.name || 'Usuario'}
                </p>
                <p className="text-xs text-foreground/60">
                  {user.roles?.join(', ') || 'user'}
                </p>
              </div>
              <UI.Avatar
                size="sm"
                name={user.name || 'U'}
                className="bg-primary-500 text-white"
                classNames={{
                  base: 'ring-2 ring-primary-500/20',
                }}
              />
            </div>
          </UI.NavbarItem>
        )}

        {/* Main Menu */}
        <UI.NavbarItem className="flex">
          <UI.Dropdown placement="bottom-end">
            <UI.DropdownTrigger>
              <UI.Button
                aria-label="Menú"
                startContent={<Icons.IoMenuOutline size={20} />}
                variant="light"
                className="text-foreground/80 hover:text-foreground"
                size="md"
              >
                <span className="hidden sm:inline">Menú</span>
              </UI.Button>
            </UI.DropdownTrigger>

            <UI.DropdownMenu aria-label="Menu Actions">
              <UI.DropdownItem
                key="logout"
                startContent={<Icons.IoLogOutOutline size={18} />}
                className="text-danger"
                color="danger"
                onPress={onLogout}
              >
                Cerrar sesión
              </UI.DropdownItem>
            </UI.DropdownMenu>
          </UI.Dropdown>
        </UI.NavbarItem>
      </UI.NavbarContent>
    </UI.Navbar>
  );
};