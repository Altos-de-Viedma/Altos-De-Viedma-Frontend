import { ReactNode } from 'react';
import { UI, Icons } from '../';
import { IUser } from '../../pages/users/interfaces';

interface Props {
  user: IUser;
  children: ReactNode;
}

export const UserTooltip = ({ user, children }: Props) => {
  const tooltipContent = (
    <div className="p-3 max-w-sm">
      <div className="flex items-center gap-3 mb-3">
        <UI.Avatar
          name={`${user.name} ${user.lastName}`}
          size="md"
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"
        />
        <div>
          <h4 className="font-semibold text-white">{user.name} {user.lastName}</h4>
          <p className="text-xs text-gray-300">@{user.username}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Icons.IoCallOutline size={14} className="text-blue-400" />
          <span className="text-gray-200">{user.phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Icons.IoLocationOutline size={14} className="text-green-400" />
          <span className="text-gray-200">{user.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <Icons.IoShieldOutline size={14} className="text-purple-400" />
          <div className="flex flex-wrap gap-1">
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

        <div className="flex items-center gap-2">
          <Icons.IoCalendarOutline size={14} className="text-orange-400" />
          <span className="text-gray-200 text-xs">
            Registrado: {new Date(user.creationDate).toLocaleDateString('es-ES')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {user.isActive ? (
            <>
              <Icons.IoCheckmarkCircleOutline size={14} className="text-green-400" />
              <span className="text-green-300 text-xs">Usuario activo</span>
            </>
          ) : (
            <>
              <Icons.IoCloseCircleOutline size={14} className="text-red-400" />
              <span className="text-red-300 text-xs">Usuario inactivo</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <UI.Tooltip
      content={tooltipContent}
      placement="right"
      delay={300}
      closeDelay={100}
      classNames={{
        base: "max-w-none",
        content: "border border-gray-700 shadow-xl"
      }}
    >
      <span className="cursor-help hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
        {children}
      </span>
    </UI.Tooltip>
  );
};