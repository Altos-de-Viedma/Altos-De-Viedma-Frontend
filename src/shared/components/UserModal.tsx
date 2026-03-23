import { ReactNode } from 'react';
import { UI, Icons, IconContainer } from '../';
import { IUser } from '../../pages/users/interfaces';

interface Props {
  user: IUser;
  children: ReactNode;
}

export const UserModal = ({ user, children }: Props) => {
  const { isOpen, onOpen, onOpenChange } = UI.useDisclosure();

  return (
    <>
      <span
        onClick={onOpen}
        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors underline font-medium"
      >
        {children}
      </span>

      <UI.Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="2xl"
        scrollBehavior="inside"
        placement="center"
      >
        <UI.ModalContent>
          {(onClose) => (
            <>
              <UI.ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <UI.Avatar
                    name={`${user.name} ${user.lastName}`}
                    size="lg"
                    className="bg-white/20 text-white border-2 border-white/30"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{user.name} {user.lastName}</h2>
                    <p className="text-blue-100 text-sm">@{user.username}</p>
                  </div>
                </div>
              </UI.ModalHeader>

              <UI.ModalBody className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Información de contacto */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <IconContainer>
                        <Icons.IoCallOutline size={20} className="text-blue-500" />
                      </IconContainer>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                        <a
                          href={`https://web.whatsapp.com/send?phone=${user.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {user.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <IconContainer>
                        <Icons.IoLocationOutline size={20} className="text-green-500" />
                      </IconContainer>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información del sistema */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <IconContainer>
                        <Icons.IoShieldOutline size={20} className="text-purple-500" />
                      </IconContainer>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Roles</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.roles.map((role, index) => (
                            <UI.Chip
                              key={index}
                              size="sm"
                              variant="flat"
                              color="secondary"
                              className="text-xs"
                            >
                              {role}
                            </UI.Chip>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <IconContainer>
                        <Icons.IoCalendarOutline size={20} className="text-orange-500" />
                      </IconContainer>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de registro</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {new Date(user.creationDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado del usuario */}
                <div className="mt-6 p-4 border rounded-lg border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.isActive ? (
                        <>
                          <IconContainer>
                            <Icons.IoCheckmarkCircleOutline size={24} className="text-green-500" />
                          </IconContainer>
                          <div>
                            <p className="font-medium text-green-700 dark:text-green-400">Usuario Activo</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Última actividad: {user.lastActivity
                                ? new Date(user.lastActivity).toLocaleDateString('es-ES')
                                : 'Nunca'
                              }
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <IconContainer>
                            <Icons.IoCloseCircleOutline size={24} className="text-red-500" />
                          </IconContainer>
                          <div>
                            <p className="font-medium text-red-700 dark:text-red-400">Usuario Inactivo</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              El usuario no puede acceder al sistema
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <UI.Chip
                      color={user.isActive ? "success" : "danger"}
                      variant="flat"
                      startContent={
                        user.isActive
                          ? <Icons.IoCheckmarkOutline size={16} />
                          : <Icons.IoCloseOutline size={16} />
                      }
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </UI.Chip>
                  </div>
                </div>
              </UI.ModalBody>

              <UI.ModalFooter className="border-t border-gray-200 dark:border-gray-700 flex justify-center gap-4 py-6">
                <UI.Button
                  color="danger"
                  variant="bordered"
                  onPress={onClose}
                  startContent={<Icons.IoCloseOutline size={18} />}
                  className="min-w-32 font-medium"
                >
                  Cerrar
                </UI.Button>
                <UI.Button
                  as="a"
                  href={`https://web.whatsapp.com/send?phone=${user.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startContent={<Icons.IoLogoWhatsapp size={18} />}
                  className="min-w-48 bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  variant="solid"
                >
                  Contactar por WhatsApp
                </UI.Button>
              </UI.ModalFooter>
            </>
          )}
        </UI.ModalContent>
      </UI.Modal>
    </>
  );
};