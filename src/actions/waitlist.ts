"use server";

import { generateReferralCodeFromPhone } from "@/lib/generate-referral-code";
import { nameSchema, phoneSchema, postalCodeSchema } from "@/schema";
import { ActionResponse } from "@/types/waitlist";
import sql from "@/utils/db";
import { revalidatePath } from "next/cache";
import * as z from "zod/v4";

const waitlistSchema = z.object({
  name: nameSchema,
  zip: postalCodeSchema,
  phone: phoneSchema,
});

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

    try {
      //TODO -- handle referrer_id
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
              ${null}) 
          `;

      revalidatePath("/[locale]/(landing)/coming-soon", "layout");

      return {
        success: true,
        message: "Contact saved successfully!",
      };
    } catch (dbError: any) {
      // Handle duplicate user (unique constraint violation)
      if (dbError.code === '23505' || dbError.constraint_name?.includes('phone') || dbError.constraint_name?.includes('unique')) {
        return {
          success: true, // Return success because user already exists
          message: "You're already on the waitlist! We'll be in touch soon.",
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
