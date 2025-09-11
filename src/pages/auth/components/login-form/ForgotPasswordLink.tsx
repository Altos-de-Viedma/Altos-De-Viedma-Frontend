import React from 'react';

import type { ForgotPasswordLinkProps } from '../../interfaces';

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ( { onClick } ) => (
  <div className="flex flex-col items-center" onClick={ onClick }>
    <span className="text-gray-600 cursor-pointer">
      ¿Olvidaste tu correo o contraseña?
    </span>
  </div>
);