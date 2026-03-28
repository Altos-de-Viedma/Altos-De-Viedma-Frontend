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
      className="bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm safe-area"
      height="4rem"
    >
      {/* Left section - Theme toggle and quick nav */}
      <UI.NavbarContent justify="start" className="flex-shrink-0 min-w-0">
        <UI.NavbarItem className="center-flex gap-1 sm:gap-2 md:gap-3">
          {/* Theme Toggle - always visible */}
          <UI.Switch
            size="sm"
            color="primary"
            isSelected={darkMode === 'dark'}
            onChange={handleThemeToggle}
            aria-label={`Cambiar a tema ${darkMode === 'dark' ? 'claro' : 'oscuro'}`}
            thumbIcon={({ isSelected, className }) =>
              isSelected ? (
                <Icons.IoMoonOutline className={`${className} text-primary-500`} aria-hidden="true" />
              ) : (
                <Icons.IoSunnyOutline className={`${className} text-warning-500`} aria-hidden="true" />
              )
            }
            classNames={{
              wrapper: 'group-data-[selected=true]:bg-primary-500',
              thumb: 'group-data-[selected=true]:bg-white',
            }}
          />

          {/* Quick Navigation - Hidden on small screens */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <UI.Button
              variant="light"
              size="sm"
              startContent={<Icons.IoHomeOutline size={16} />}
              onPress={() => handleNavigate('/home')}
              className="text-foreground/70 hover:text-foreground responsive-text-xs min-w-unit-8 px-2 lg:px-3"
            >
              <span className="hidden lg:inline">Inicio</span>
            </UI.Button>

            <UI.Button
              variant="light"
              size="sm"
              startContent={<Icons.IoAlertCircleOutline size={16} />}
              onPress={() => handleNavigate('/emergencias')}
              className="text-foreground/70 hover:text-foreground responsive-text-xs min-w-unit-8 px-2 lg:px-3"
            >
              <span className="hidden lg:inline">Emergencias</span>
            </UI.Button>
          </div>
        </UI.NavbarItem>
      </UI.NavbarContent>

      {/* Center section - Brand */}
      <UI.NavbarContent justify="center" className="flex-shrink-0">
        <UI.NavbarBrand
          className="center-flex cursor-pointer px-2"
          onClick={() => handleNavigate('/home')}
        >
          <h1 className="font-semibold responsive-text-base text-foreground/80 hover:text-foreground transition-colors duration-200 text-center truncate max-w-[200px] sm:max-w-none">
            Altos de Viedma
          </h1>
        </UI.NavbarBrand>
      </UI.NavbarContent>

      {/* Right section - User menu */}
      <UI.NavbarContent justify="end" className="flex-shrink-0 min-w-0">
        {user && (
          <UI.NavbarItem className="center-flex">
            <div className="center-flex gap-1 sm:gap-2 md:gap-3">
              {/* User Info - Hidden on small screens */}
              <div className="hidden sm:block text-right min-w-0">
                <p className="responsive-text-xs font-medium text-foreground truncate max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-none">
                  {user.name || 'Usuario'}
                </p>
                <p className="text-xs text-foreground/60 truncate max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-none">
                  {user.roles?.join(', ') || 'user'}
                </p>
              </div>

              {/* Avatar Dropdown */}
              <UI.Dropdown placement="bottom-end">
                <UI.DropdownTrigger>
                  <UI.Avatar
                    as="button"
                    size="sm"
                    name={user.name || 'U'}
                    className="bg-primary-500 text-white cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
                    classNames={{
                      base: 'ring-2 ring-primary-500/20 hover:ring-primary-500/40',
                    }}
                  />
                </UI.DropdownTrigger>

                <UI.DropdownMenu aria-label="User Actions" className="w-64 max-w-[90vw]">
                  <UI.DropdownItem
                    key="profile"
                    startContent={<Icons.IoPersonOutline size={18} />}
                    className="text-foreground"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium responsive-text-sm truncate">{user.name || 'Usuario'}</span>
                      <span className="text-xs text-foreground/60 truncate">
                        {user.roles?.join(', ') || 'user'}
                      </span>
                    </div>
                  </UI.DropdownItem>

                  <UI.DropdownItem
                    key="divider"
                    className="opacity-0 cursor-default"
                  >
                    <UI.Divider />
                  </UI.DropdownItem>

                  {/* Mobile navigation items */}
                  <UI.DropdownItem
                    key="home"
                    startContent={<Icons.IoHomeOutline size={18} />}
                    className="text-foreground md:hidden"
                    onPress={() => handleNavigate('/home')}
                  >
                    Inicio
                  </UI.DropdownItem>

                  <UI.DropdownItem
                    key="emergencies"
                    startContent={<Icons.IoAlertCircleOutline size={18} />}
                    className="text-foreground md:hidden"
                    onPress={() => handleNavigate('/emergencias')}
                  >
                    Emergencias
                  </UI.DropdownItem>

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
            </div>
          </UI.NavbarItem>
        )}
      </UI.NavbarContent>
    </UI.Navbar>
  );
};