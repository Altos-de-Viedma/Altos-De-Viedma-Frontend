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
    <div className="layout-content bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="wide-container responsive-padding">
        {/* Back button with responsive spacing */}
        <div className="mb-4 sm:mb-6">
          <BackButton url={ backUrl } />
        </div>

        {/* Main card with responsive design - much wider on desktop */}
        <div className="w-full">
          <UI.Card className="w-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl sm:rounded-2xl">
            <UI.CardHeader className="center-flex px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-900/50">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-6 text-center sm:text-left w-full max-w-none">
                <div className="flex-shrink-0">
                  <IconContainer
                    children={ icon }
                    className="text-primary-600 dark:text-primary-400 p-2 sm:p-3 lg:p-4 bg-primary-500/10 rounded-xl"
                  />
                </div>
                <h2 className="responsive-text-lg sm:responsive-text-xl lg:text-2xl xl:text-3xl font-bold text-gradient">
                  { title }
                </h2>
              </div>
            </UI.CardHeader>

            <UI.CardBody className="p-4 sm:p-6 lg:p-8 xl:p-12 2xl:p-16 space-y-4 sm:space-y-6 lg:space-y-8">
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