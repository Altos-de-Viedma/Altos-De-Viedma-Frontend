import React from 'react';
import { Checkbox } from '@nextui-org/react';


import { typeAccess, tableHeaders } from './data';
import { useThemeStore } from '../../../../../store';

export const StudentsTable: React.FC = () => {

  const { darkMode } = useThemeStore();

  const borderColor = darkMode === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const bgColor = darkMode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const hoverColor = darkMode === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100';
  const headerColor = darkMode === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const stickyHeaderColor = darkMode === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <div className="w-full h-[600px] overflow-hidden border border-gray-300">
      <div className="w-full h-full overflow-x-auto overflow-y-auto">
        <div className="min-w-full">
          <table className={ `min-w-full ${ bgColor } border-collapse` }>
            <thead>
              <tr
                className={ `sticky top-0 z-50 ${ headerColor } ${ borderColor } border-b` }
                style={ { zIndex: 50 } }
              >
                { tableHeaders.map( ( header, index ) => (
                  <th
                    key={ index }
                    className={ `px-4 py-2 border ${ borderColor } ${ index === 0 ? `sticky left-0 ${ stickyHeaderColor } border-r-2 z-40` : '' }` }
                  >
                    { header.name }
                  </th>
                ) ) }
              </tr>
            </thead>
            <tbody>
              { typeAccess.map( ( access ) => (
                <tr
                  key={ access.name }
                  className={ `${ hoverColor } transition-colors duration-200` }
                >
                  <td
                    className={ `px-4 py-2 border ${ borderColor } text-center sticky left-0 ${ stickyHeaderColor } border-r-2 z-40` }
                    style={ { zIndex: 40 } }
                  >
                    { access.name }
                  </td>
                  { new Array( tableHeaders.length - 1 ).fill( null ).map( ( _, index ) => (
                    <td
                      key={ index }
                      className={ `px-4 py-2 border ${ borderColor } text-center` }
                    >
                      <Checkbox />
                    </td>
                  ) ) }
                </tr>
              ) ) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};