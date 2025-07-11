"use client";
import { SubmitWaitlistRequest } from "@/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeFarsiDigits } from "@/lib/normalize-farsi-digits";
import { phoneDisplayFormat } from "@/lib/phone-display-format";
import { cn } from "@/lib/utils";
import { ActionResponse } from "@/types/waitlist";
import { Loader2Icon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";

const initialState: ActionResponse = {
  success: false,
  message: "",
};

const validateAndFormatPostCode = (raw: string) => {
  // Remove all non-alphanumeric characters first
  const clean = raw.replace(/[^A-Z0-9]/g, "");
  let formatted = "";

  for (let i = 0; i < clean.length && i < 6; i++) {
    const char = clean[i];

    // Canadian postal code pattern: A1A 1A1
    if (i === 0 || i === 2 || i === 4) {
      // Positions 0, 2, 4 should be letters
      if (/[A-Z]/.test(char)) {
        formatted += char;
        // Add space after the first 3 characters (A1A)
        if (i === 2 && clean.length > 3) {
          formatted += " ";
        }
      } else {
        // Invalid character at letter position, stop formatting
        break;
      }
    } else if (i === 1 || i === 3 || i === 5) {
      // Positions 1, 3, 5 should be digits
      if (/[0-9]/.test(char)) {
        formatted += char;
      } else {
        // Invalid character at digit position, stop formatting
        break;
      }
    }
  }

  return formatted;
};

interface WaitlistFormProps {
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  onSuccess?: (data: { message: string; referralLink?: string }) => void;
  variant?: string;
}

export const WaitlistForm = ({
  setIsSuccess,
  onSuccess,
  variant,
}: WaitlistFormProps) => {
  const t = useTranslations("WaitlistForm");
  const locale = useLocale();

  const version = variant || "unknown";

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

    if (state.success) {
      setIsSuccess(true);
      onSuccess?.({
        message: state.message,
        referralLink: state.referralLink,
      });
    }
  }, [state, setIsSuccess, onSuccess]);

  return (
    <form
      id="waitlist-form"
      action={action}
      className="w-full flex flex-col items-stretch gap-2 animate-in fade-in-0 duration-300"
      autoComplete="on"
    >
      <div>
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
            "ring-brand-teal selection:text-background selection:bg-brand-teal",
            state.errors?.name ? "border-red-500 ring-red-400" : ""
          )}
          type="text"
        />
        <div className="text-xs text-red-500 min-h-2">
          {state.errors?.name && t(state.errors.name[0])}
        </div>
      </div>

      <div>
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
            const formatted = validateAndFormatPostCode(raw);
            setPostalCodeInput(formatted);
          }}
          className={cn(
            "ring-brand-teal selection:text-background selection:bg-brand-teal",
            state.errors?.zip ? "border-red-500 ring-red-400" : ""
          )}
          type="text"
        />
        <div className="text-xs text-red-500 min-h-2">
          {state.errors?.zip && t(state.errors.zip[0])}
        </div>
      </div>
      <div>
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
            "ring-brand-teal selection:text-backgrounds selection:bg-brand-teal",
            state.errors?.phone ? "border-red-500 ring-red-400" : "",
            locale === "fa" ? "text-right placeholder:text-right" : ""
          )}
        />
        <div className="text-xs text-red-500 min-h-2">
          {state.errors?.phone && t(state.errors.phone[0])}
        </div>
      </div>

      <Button
        id="submit-btn"
        data-umami-event="Submit button"
        data-umami-event-version={version}
        data-umami-event-language={locale}
        size="lg"
        className="text-lg font-bold"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2Icon className="animate-spin" />
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
