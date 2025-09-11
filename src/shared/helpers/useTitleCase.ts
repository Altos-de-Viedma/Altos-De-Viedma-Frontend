export const toTitleCase = ( str: string ) => {
  return str.replace( /(^\w|\.\s+\w)/g, ( match ) => match.toUpperCase() );
};