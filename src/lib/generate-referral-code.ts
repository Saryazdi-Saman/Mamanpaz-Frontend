/**
 * Generates a unique referral code from a phone number
 * @param phoneNumber - 10-digit phone number string (e.g., "5141234567")
 * @param encoding - 'base32' or 'base64' (default: 'base32')
 * @returns A unique referral code derived from the phone number
 */
export function generateReferralCodeFromPhone(
  phoneNumber: string, 
  encoding: 'base32' | 'base64' = 'base32'
): string {
  // Remove any non-digit characters and ensure it's 10 digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  if (cleanPhone.length !== 10) {
    throw new Error('Phone number must be exactly 10 digits');
  }
  
  // Convert to number
  const phoneNum = BigInt(cleanPhone);
  
  if (encoding === 'base32') {
    return convertToBase32(phoneNum);
  } else {
    return convertToBase64(phoneNum);
  }
}

/**
 * Converts a BigInt to base32 (using Crockford's Base32 - no confusing characters)
 */
function convertToBase32(num: bigint): string {
  // Crockford's Base32 alphabet (excludes I, L, O, U to avoid confusion)
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const base = BigInt(32);
  
  if (num === BigInt(0)) return '0';
  
  let result = '';
  let temp = num;
  
  while (temp > BigInt(0)) {
    result = alphabet[Number(temp % base)] + result;
    temp = temp / base;
  }
  
  return result;
}

/**
 * Converts a BigInt to base64 (URL-safe)
 */
function convertToBase64(num: bigint): string {
  // URL-safe base64 alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const base = BigInt(64);
  
  if (num === BigInt(0)) return 'A';
  
  let result = '';
  let temp = num;
  
  while (temp > BigInt(0)) {
    result = alphabet[Number(temp % base)] + result;
    temp = temp / base;
  }
  
  return result;
}

/**
 * Converts a referral code back to the original phone number
 * @param code - The referral code
 * @param encoding - 'base32' or 'base64'
 * @returns The original 10-digit phone number
 */
export function decodeReferralCode(
  code: string, 
  encoding: 'base32' | 'base64' = 'base32'
): string {
  let phoneNum: bigint;
  
  if (encoding === 'base32') {
    phoneNum = decodeFromBase32(code);
  } else {
    phoneNum = decodeFromBase64(code);
  }
  
  // Convert back to 10-digit string, pad with zeros if needed
  return phoneNum.toString().padStart(10, '0');
}

function decodeFromBase32(code: string): bigint {
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const base = BigInt(32);
  
  let result = BigInt(0);
  for (const char of code) {
    const index = alphabet.indexOf(char.toUpperCase());
    if (index === -1) throw new Error(`Invalid character in base32 code: ${char}`);
    result = result * base + BigInt(index);
  }
  
  return result;
}

function decodeFromBase64(code: string): bigint {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const base = BigInt(64);
  
  let result = BigInt(0);
  for (const char of code) {
    const index = alphabet.indexOf(char);
    if (index === -1) throw new Error(`Invalid character in base64 code: ${char}`);
    result = result * base + BigInt(index);
  }
  
  return result;
}