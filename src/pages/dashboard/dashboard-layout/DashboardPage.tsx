import { Outlet } from 'react-router-dom';

import { NavBarComponent } from '../../../shared';

export const DashboardLayoutPage: React.FC = () => {
  return (
    <div className="dashboard-container safe-area">
      <NavBarComponent />
      <main className="dashboard-content">
        <div className="full-width-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
