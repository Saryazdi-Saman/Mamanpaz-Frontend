"use server";

import { generateReferralCodeFromPhone } from "@/lib/generate-referral-code";
import { nameSchema, phoneSchema, postalCodeSchema } from "@/schema";
import { ActionResponse } from "@/types/waitlist";
import sql from "@/utils/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as z from "zod/v4";

const waitlistSchema = z.object({
  name: nameSchema,
  zip: postalCodeSchema,
  phone: phoneSchema,
});

/**
 * Looks up referrer information from the 'ref' cookie
 * @returns Object with referrer_id and referrer_name, or null if not found
 */
async function getReferrerFromCookie(): Promise<{ referrer_id: string; referrer_name: string } | null> {
  try {
    const cookieStore = await cookies();
    const refCookie = cookieStore.get('ref');
    
    if (!refCookie?.value) {
      return null;
    }

    const referralCode = refCookie.value;
    
    // Query database for user with matching referral_code
    const referrerQuery = await sql`
      SELECT id, name 
      FROM users 
      WHERE referral_code = ${referralCode}
      LIMIT 1
    `;

    if (referrerQuery.length === 0) {
      console.warn(`Referral code '${referralCode}' not found in database`);
      return null;
    }

    return {
      referrer_id: referrerQuery[0].id,
      referrer_name: referrerQuery[0].name
    };
  } catch (error) {
    console.error('Error looking up referrer:', error);
    return null;
  }
}

export async function SubmitWaitlistRequest(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    name: formData.get("name") as string,
    zip: formData.get("zip") as string,
    phone: formData.get("phone") as string,
    phone_display: formData.get("phone_display") as string,
  };

  try {
    // Validate the form data
    const validateData = waitlistSchema.safeParse(rawData);

    if (!validateData.success) {
      return {
        success: false,
        inputs: rawData,
        message: "Please fix the errors in the form",
        errors: z.flattenError(validateData.error).fieldErrors,
      };
    }

    const referralCode = generateReferralCodeFromPhone(validateData.data.phone.slice(-10));
    
    // Look up referrer from cookie
    const referrerInfo = await getReferrerFromCookie();

    try {
      const submit = await sql`
          INSERT INTO users (
              name, 
              phone, 
              zip, 
              referral_code, 
              referrer_id
          ) VALUES (
              ${validateData.data.name},
              ${validateData.data.phone}, 
              ${validateData.data.zip}, 
              ${referralCode}, 
              ${referrerInfo?.referrer_id || null}) 
          `;

      // If there's a referrer, log the referral message
      if (referrerInfo) {
        try {
          await sql`
            INSERT INTO messages (message) 
            VALUES (${`${referrerInfo.referrer_name} just referred us. Thanks!`})
          `;
        } catch (messageError) {
          // Log error but don't fail the signup if message insert fails
          console.error('Failed to insert referral message:', messageError);
        }
      }

      revalidatePath("/[locale]/(landing)/coming-soon", "layout");

      return {
        success: true,
        message: "Contact saved successfully!",
        referralLink: `https://www.mamanpazmeals.com?ref=${referralCode}`,
      };
    } catch (dbError: any) {
      // Handle duplicate user (unique constraint violation)
      if (dbError.code === '23505' || dbError.constraint_name?.includes('phone') || dbError.constraint_name?.includes('unique')) {
        return {
          success: true, // Return success because user already exists
          message: "You're already on the waitlist! We'll be in touch soon.",
          referralLink: `https://www.mamanpazmeals.com?ref=${referralCode}`,
        };
      }

      // Log unexpected database errors for debugging
      console.error('Database error:', dbError);
      
      return {
        success: false,
        inputs: rawData,
        message: "An unexpected error occurred while saving your information",
      };
    }
  } catch (error) {
    console.error('Validation error:', error);
    return {
      success: false,
      inputs: rawData,
      message: "An unexpected error occurred",
    };
  }
}
