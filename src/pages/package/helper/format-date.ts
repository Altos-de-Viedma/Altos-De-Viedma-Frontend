
import { BuenosAiresDateUtils } from '../../../shared/utils/buenos-aires-date.utils';

/**
 * Formatea fechas usando exclusivamente la zona horaria de Buenos Aires, Argentina
 * TODAS las fechas del sistema deben usar esta zona horaria
 */
export const formatDate = ( date: string | Date ): string => {
  return BuenosAiresDateUtils.formatCustom(date);
};
