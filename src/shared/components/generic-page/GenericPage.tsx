import { ReactNode } from 'react';

import { BackButton, IconContainer, UI } from '../../../shared';



interface GenericPageProps {
  backUrl: string;
  title: string;
  icon: ReactNode;
  bodyContent: ReactNode;
}

export const GenericPage = ( {
  backUrl,
  icon,
  title,
  bodyContent
}: GenericPageProps ) => {
  return (
    <div className="layout-content min-h-screen">
      <div className="w-full px-2 sm:px-3 md:px-4">
        {/* Back button with minimal spacing */}
        <div className="mb-2 sm:mb-3">
          <BackButton url={ backUrl } />
        </div>

        {/* Main card with minimal padding */}
        <div className="w-full">
          <UI.Card className="w-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl sm:rounded-2xl">
            <UI.CardHeader className="center-flex px-2 sm:px-3 lg:px-4 py-2 sm:py-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left w-full max-w-none">
                <div className="flex-shrink-0">
                  <IconContainer
                    children={ icon }
                    className="text-primary-600 dark:text-primary-400 p-2 sm:p-3 bg-primary-500/10 rounded-xl"
                  />
                </div>
                <h2 className="responsive-text-lg sm:responsive-text-xl lg:text-2xl font-bold text-gradient">
                  { title }
                </h2>
              </div>
            </UI.CardHeader>

            <UI.CardBody className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
              <div className="w-full">
                { bodyContent }
              </div>
            </UI.CardBody>
          </UI.Card>
        </div>
      </div>
    </div>
  );
};