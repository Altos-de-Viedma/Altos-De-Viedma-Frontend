import { Outlet } from 'react-router-dom';

import { NavBarComponent } from '../../../shared';

export const DashboardLayoutPage: React.FC = () => {
  return (
    <div>
      <NavBarComponent />
      <div className="md:p-4 p-2">
        <Outlet />
      </div>
    </div>
  );
};
