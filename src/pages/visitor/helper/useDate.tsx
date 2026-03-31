import { BuenosAiresDateUtils } from '../../../shared/utils/buenos-aires-date.utils';

export const useDate = () => {
  const formatDate = ( dateString: string ): string => {
    return BuenosAiresDateUtils.formatCustom(dateString);
  };

  return { formatDate };
};