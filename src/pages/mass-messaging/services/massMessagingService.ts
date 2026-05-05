import { IMessageRequest, IMessageResponse, IOwnerContact } from '../interfaces';

export class MassMessagingService {
  private static readonly WEBHOOK_URL = 'https://n8n.altosdeviedma.com/webhook/send-message';
  private static readonly SERVER_URL = 'https://evolution-api.altosdeviedma.com';
  private static readonly INSTANCE_NAME = 'AltosDeViedmaProduccion';
  private static readonly API_KEY = '782A3BE06AAC-47C5-AE61-4985CB15631E';

  /**
   * Replaces variables in message template with owner data
   */
  private static replaceMessageVariables(messageTemplate: string, owner: IOwnerContact): string {
    let personalizedMessage = messageTemplate;

    // Replace variables with owner data
    personalizedMessage = personalizedMessage.replace(/\{\{nombre_propietario\}\}/g, `${owner.name} ${owner.lastName}`);
    personalizedMessage = personalizedMessage.replace(/\{\{nombre\}\}/g, owner.name);
    personalizedMessage = personalizedMessage.replace(/\{\{apellido\}\}/g, owner.lastName);

    return personalizedMessage;
  }

  /**
   * Formats phone number to WhatsApp format (54911...)
   */
  private static formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');

    // If it already starts with 54911, return as is
    if (cleanPhone.startsWith('54911')) {
      return cleanPhone;
    }

    // If it starts with 549, add 11
    if (cleanPhone.startsWith('549')) {
      return cleanPhone.replace('549', '54911');
    }

    // If it starts with 54, add 911
    if (cleanPhone.startsWith('54')) {
      return cleanPhone.replace('54', '54911');
    }

    // If it starts with 11, add 549
    if (cleanPhone.startsWith('11')) {
      return `549${cleanPhone}`;
    }

    // If it's a local number (starts with 15 or is 8 digits), format it
    if (cleanPhone.startsWith('15')) {
      return `54911${cleanPhone.substring(2)}`;
    }

    // If it's 8 digits, assume it's a local number
    if (cleanPhone.length === 8) {
      return `54911${cleanPhone}`;
    }

    // If it's 10 digits and starts with area code, format accordingly
    if (cleanPhone.length === 10) {
      return `549${cleanPhone}`;
    }

    // Default: prepend 54911 if nothing else matches
    return `54911${cleanPhone}`;
  }

  /**
   * Sends a message to a single recipient
   */
  static async sendMessage(
    message: string,
    phoneNumber: string,
    token: string
  ): Promise<IMessageResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const messageRequest: IMessageRequest = {
        serverUrl: this.SERVER_URL,
        message,
        phoneNumber: formattedPhone,
        instanceName: this.INSTANCE_NAME,
        apikey: this.API_KEY
      };

      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json(); // Consume the response but don't store it

      return {
        success: true,
        message: 'Mensaje enviado correctamente'
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Sends messages to multiple recipients with delay between sends
   */
  static async sendMassMessages(
    messageTemplate: string,
    recipients: IOwnerContact[],
    token: string,
    onProgress?: (sent: number, total: number, currentRecipient: string) => void,
    delayMs: number = 2000
  ): Promise<{ successful: number; failed: number; results: Array<{ recipient: IOwnerContact; success: boolean; error?: string }> }> {
    const results: Array<{ recipient: IOwnerContact; success: boolean; error?: string }> = [];
    let successful = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];

      try {
        onProgress?.(i, recipients.length, `${recipient.name} ${recipient.lastName}`);

        // Personalize message for each recipient
        const personalizedMessage = this.replaceMessageVariables(messageTemplate, recipient);

        const result = await this.sendMessage(personalizedMessage, recipient.phone, token);

        if (result.success) {
          successful++;
          results.push({ recipient, success: true });
        } else {
          failed++;
          results.push({ recipient, success: false, error: result.error });
        }
      } catch (error) {
        failed++;
        results.push({
          recipient,
          success: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }

      // Add delay between messages (except for the last one)
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    onProgress?.(recipients.length, recipients.length, 'Completado');

    return { successful, failed, results };
  }
}