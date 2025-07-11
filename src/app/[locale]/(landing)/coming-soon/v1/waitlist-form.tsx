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
import { Dispatch, SetStateAction, useActionState, useEffect, useRef, useState } from "react";

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

  return formatted;
};

interface WaitlistFormProps {
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  onSuccess?: (data: { message: string; referralLink?: string }) => void;
}

export const WaitlistForm = ({ setIsSuccess, onSuccess }: WaitlistFormProps) => {
  const t = useTranslations("WaitlistForm");
  const locale = useLocale();

  const [phoneInput, setPhoneInput] = useState("");
  const [postalCodeInput, setPostalCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        referralLink: state.referralLink
      });
    }
  }, [state, setIsSuccess, onSuccess]);

  const cleanUrl = (url: string) => {
    if (!url) return "";
    return url.replace(/^https?:\/\/(www\.)?/, "");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTooltipOpen(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
      // Keep focus on the button after copying
      copyButtonRef.current?.focus();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };


  return (
    <form
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

      <Button size="lg" className="text-lg font-bold" disabled={isPending}>
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
