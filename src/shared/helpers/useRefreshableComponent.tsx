import { useState, useCallback } from 'react';

export const useRefreshableComponent = () => {
  const [ refreshKey, setRefreshKey ] = useState( 0 );

  const refresh = useCallback( () => {
    setRefreshKey( prevKey => prevKey + 1 );
  }, [] );

  return { refreshKey, refresh };
};