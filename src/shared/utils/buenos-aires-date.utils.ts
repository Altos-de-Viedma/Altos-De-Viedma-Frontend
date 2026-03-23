/**
 * Utilidad centralizada para manejar fechas en Buenos Aires, Argentina
 * TODAS las fechas del sistema deben usar esta zona horaria
 */
export class BuenosAiresDateUtils {
  private static readonly TIMEZONE = 'America/Argentina/Buenos_Aires';

  /**
   * Obtiene la fecha y hora actual en Buenos Aires
   */
  static now(): Date {
    return new Date(new Date().toLocaleString('en-US', { timeZone: this.TIMEZONE }));
  }

  /**
   * Convierte cualquier fecha a la zona horaria de Buenos Aires
   */
  static toBuenosAires(date: Date | string): Date {
    return new Date(new Date(date).toLocaleString('en-US', { timeZone: this.TIMEZONE }));
  }

  /**
   * Formatea una fecha en Buenos Aires para mostrar al usuario
   */
  static format(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: this.TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const formatOptions = { ...defaultOptions, ...options };

    return new Date(date).toLocaleString('es-AR', formatOptions);
  }

  /**
   * Formatea una fecha en Buenos Aires con formato personalizado
   */
  static formatCustom(date: Date | string): string {
    const buenosAiresDate = this.toBuenosAires(date);

    const day = buenosAiresDate.getDate().toString().padStart(2, '0');
    const month = (buenosAiresDate.getMonth() + 1).toString().padStart(2, '0');
    const year = buenosAiresDate.getFullYear();
    const hours = buenosAiresDate.getHours();
    const minutes = buenosAiresDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    const hour12 = hours % 12 || 12;

    return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
  }

  /**
   * Obtiene la zona horaria configurada
   */
  static getTimezone(): string {
    return this.TIMEZONE;
  }

  /**
   * Convierte fecha a string ISO en Buenos Aires
   */
  static toISOString(date?: Date | string): string {
    const targetDate = date ? new Date(date) : new Date();
    return this.toBuenosAires(targetDate).toISOString();
  }
}