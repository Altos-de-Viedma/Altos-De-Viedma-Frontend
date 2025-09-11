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
    <>
      <div className="mb-4">
        <BackButton url={ backUrl } />
      </div>
      <UI.Card>
        <UI.CardHeader className="flex items-center justify-center px-4 py-4">
          <div className="flex items-center space-x-2 font-bold text-2xl">
            <IconContainer children={ icon } className="text-gray-500" />
            <h2>{ title }</h2>
          </div>
        </UI.CardHeader>

        <UI.CardBody className="space-y-3 p-4 sm:p-6 md:p-8">
          { bodyContent }
        </UI.CardBody>
      </UI.Card>
    </>
  );
};