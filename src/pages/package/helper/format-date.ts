
export const formatDate = ( date: string | Date ): string => {
  const d = new Date( date );

  const day = d.getDate().toString().padStart( 2, '0' );
  const month = ( d.getMonth() + 1 ).toString().padStart( 2, '0' );
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart( 2, '0' );
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  const hour12 = hours % 12 || 12; 

  return `${ day }/${ month }/${ year } ${ hour12 }:${ minutes } ${ ampm }`;
};
