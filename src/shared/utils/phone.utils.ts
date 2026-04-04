/**
 * Format phone number to ensure consistent format with backend
 * Matches the backend formatPhoneNumber logic
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return phone;

  // Remove spaces and special characters
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // If already starts with 549, return as is
  if (cleanPhone.startsWith('549')) {
    return cleanPhone;
  }

  // If starts with +549, remove the +
  if (cleanPhone.startsWith('+549')) {
    return cleanPhone.substring(1);
  }

  // If starts with 54 but not 549, add 9
  if (cleanPhone.startsWith('54') && !cleanPhone.startsWith('549')) {
    return '549' + cleanPhone.substring(2);
  }

  // If doesn't start with 54, add 549 prefix
  return '549' + cleanPhone;
};