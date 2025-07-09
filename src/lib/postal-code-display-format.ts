export function postalCodeDisplayFormat(value: string): string {
  // Strip all non-alphanumeric characters and convert to uppercase
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Canadian postal code format: A1A 1A1
  if (cleaned.length <= 3) {
    return cleaned;
  }
  
  if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  
  // Limit to 6 characters max
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
}