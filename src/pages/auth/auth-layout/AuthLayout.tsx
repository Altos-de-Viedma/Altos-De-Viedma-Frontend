import { useEffect } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';

import { IconContainer, UI, useRedirect } from '../../../shared';
import { useAuthStore } from '../store';

export const AuthLayout = () => {
  const { redirectTo } = useRedirect();
  const { status } = useAuthStore();

  useEffect(() => {
    if (status === 'authorized') {
      redirectTo('/home');
    }
  }, [status, redirectTo]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-animated"></div>

      <div className="absolute inset-0 flex justify-center items-start md:items-center z-20 p-3 pt-[200px] md:pt-0">
        <UI.Card className="w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
          <UI.CardHeader className="flex justify-center flex-col cursor-pointer" onClick={() => redirectTo('/ingresar')}>
            <IconContainer children={<IoHomeOutline size={29} className="md:mt-1 mr-1 text-gray-600" />} />
            <h1 className="font-bold text-inherit text-2xl mt-[4px] text-gray-800 dark:text-gray-200">Altos de Viedma</h1>
          </UI.CardHeader>

          <UI.CardBody>
            <Outlet />
          </UI.CardBody>
        </UI.Card>
      </div>
    </div>
  );
};
