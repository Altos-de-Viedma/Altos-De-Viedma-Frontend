export const useDate = () => {
  const formatDate = ( dateString: string ): string => {
    const date = new Date( dateString );

    const day = date.getDate().toString().padStart( 2, '0' );
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' );
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart( 2, '0' );
    const minutes = date.getMinutes().toString().padStart( 2, '0' );
    const ampm = date.getHours() >= 12 ? 'P.M.' : 'A.M.';

    return `${ day }/${ month }/${ year } ${ hours }:${ minutes } ${ ampm }`;
  };

  return { formatDate };
};