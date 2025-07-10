"use client";
import { SubmitWaitlistRequest } from "@/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeFarsiDigits } from "@/lib/normalize-farsi-digits";
import { phoneDisplayFormat } from "@/lib/phone-display-format";
import { cn } from "@/lib/utils";
import { ActionResponse } from "@/types/waitlist";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

const validateAndFormatPostCode = (raw: string) => {
  let formatted = "";

  for (let i = 0; i < raw.length && formatted.length < 7; i++) {
    const char = raw[i];
    const pos = formatted.replace(" ", "").length; // Position ignoring space

    // Canadian postal code pattern: A1A 1A1
    if (pos === 0 || pos === 2 || pos === 4) {
      // Positions 0, 2, 4 should be letters
      if (/[A-Z]/.test(char)) {
        formatted += char;
        if (pos === 2) formatted += " "; // Add space after A1A
      }
    } else if (pos === 1 || pos === 3 || pos === 5) {
      // Positions 1, 3, 5 should be digits
      if (/[0-9]/.test(char)) {
        formatted += char;
      }
    }
  }

  return formatted
};

export const CTA = () => {
  const t = useTranslations("WaitlistForm");

  const [phoneInput, setPhoneInput] = useState("");
  const [postalCodeInput, setPostalCodeInput] = useState("");

  const [state, action, isPending] = useActionState(
    SubmitWaitlistRequest,
    initialState
  );

  // Update inputs when server returns validation errors with preserved input
  useEffect(() => {
    const digits = state.inputs?.phone ?? "";
    setPhoneInput(digits);

    const post = state.inputs?.zip ?? "";
    setPostalCodeInput(post);
  }, [state]);

  return (
    <form
      action={action}
      className=" w-full flex flex-col items-stretch gap-3 "
      autoComplete="on"
    >
      <Input
        id="name"
        name="name"
        placeholder={t("name")}
        defaultValue={state.inputs?.name}
        required
        minLength={2}
        maxLength={100}
        autoComplete="name"
        enterKeyHint="next"
        className={cn(
          "ring-brand-teal selection:text-background text-background selection:bg-brand-teal",
          state.errors?.name ? "border-red-500" : ""
        )}
        type="text"
      />

      <Input
        id="zip"
        name="zip"
        placeholder={t("postCode")}
        value={postalCodeInput}
        required
        autoComplete="postal-code"
        pattern="^[A-Z]\d[A-Z] \d[A-Z]\d$"
        title="Enter a valid Canadian postal code (e.g. M5V 3A8)"
        enterKeyHint="next"
        onInput={(e) => {
          const raw = e.currentTarget.value.toUpperCase();
          const formatted = validateAndFormatPostCode(raw)
          setPostalCodeInput(formatted);
        }}
        className={cn(
          "ring-brand-teal selection:text-background  text-background selection:bg-brand-teal",
          state.errors?.zip ? "border-red-500" : ""
        )}
        type="text"
      />

      <Input
        id="phone"
        name="phone"
        placeholder={t("phone")}
        value={phoneInput}
        required
        title={t("phoneValidation")}
        inputMode="numeric"
        translate="no"
        pattern="^\(\d{3}\) \d{3}-\d{4}$"
        autoComplete="tel"
        type="tel"
        enterKeyHint="done"
        onInput={(e) => {
          const raw = e.currentTarget.value;
          const normalized = normalizeFarsiDigits(raw); // convert farsi and arabic fonts to latin digits
          const value = normalized.replace(/\D/g, ""); // remove all none numeric chars
          setPhoneInput(phoneDisplayFormat(value)); // Store raw digits for validation
        }}
        className={cn(
          "ring-brand-teal selection:text-background  text-background selection:bg-brand-teal",
          state.errors?.phone ? "border-red-500" : ""
        )}
      />

      <Button size="lg" className="text-lg font-bold h-14" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            {t("button")}
          </>
        ) : (
          t("button")
        )}
      </Button>
      <div className="text-sm opacity-70 tracking-wide"></div>
    </form>
  );
};
