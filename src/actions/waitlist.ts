"use server";

import { nameSchema, phoneSchema, postalCodeSchema } from "@/schema";
import { ActionResponse } from "@/types/waitlist";
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
        const validateData = waitlistSchema.safeParse(rawData)
        
        if (!validateData.success) {
            return {
                success: false,
                inputs: rawData,
                message: 'Please fix the errors in the form',
                errors: z.flattenError(validateData.error).fieldErrors,
            }
        }

        //TODO - submit the data

        return {
            success: true,
            message: 'Contact saved successfully!'
        }
    } catch (error) {
        return {
            success: false,
            inputs: rawData,
            message: "An unexpected error occurred"
        }
    }
}
