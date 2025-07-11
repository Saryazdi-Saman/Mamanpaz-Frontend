import * as z from 'zod/v4'

import { normalizeFarsiDigits } from '@/lib/normalize-farsi-digits';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const postalCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .refine((code) => {
    // Canadian postal code format: A1A 1A1 or A1A-1A1 (6-7 characters)
    const postalCodePattern = /^[A-Z]\d[A-Z][\s-]?\d[A-Z]\d$/;
    return postalCodePattern.test(code);
  }, {
    message: "invalidPostalCode"
  })
  .transform((code) => {
    // Normalize to standard format with space: A1A 1A1
    return code.replace(/[\s-]/, ' ').replace(/\s+/, ' ');
  });

export const phoneSchema = z
  .string()
  .transform((input) => parsePhoneNumberFromString(normalizeFarsiDigits(input), 'CA'))
  .refine((phone) => phone?.isValid() ?? false,
    {
      message: "invalidPhone"
    }
  )
  .transform((phone) => phone!.number);

export const nameSchema = z
  .string()
  .trim()
  .min(2, "nameMinLength")
  .max(100, "nameMaxLength")
  .refine((name) => {
    // Allow letters (English, Persian, Arabic), spaces, hyphens, apostrophes
    const namePattern = /^[\u0041-\u005A\u0061-\u007A\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u200C\u200D\s\-'\.]+$/;
    return namePattern.test(name);
  }, {
    message: "invalidNameCharacters"
  })
  .transform((name) => {
    // Normalize spaces first
    const spacesNormalized = name.replace(/\s+/g, ' ');
    
    // Title case for Latin characters only, preserve Persian characters as-is
    return spacesNormalized.replace(/\b[a-zA-Z]+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  });