export const useStringToArray = (input: string): string[] => {
  return input.split(',').map(item => item.trim());
};
