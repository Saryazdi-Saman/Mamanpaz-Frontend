"use client";
import { SubmitWaitlistRequest } from "@/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeFarsiDigits } from "@/lib/normalize-farsi-digits";
import { phoneDisplayFormat } from "@/lib/phone-display-format";
import { cn } from "@/lib/utils";
import { ActionResponse } from "@/types/waitlist";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState, useRef } from "react";
import { Loader2Icon, Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export const WaitlistForm = () => {
  const t = useTranslations("WaitlistForm");

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
  }, [state]);

  const cleanUrl = (url: string) => {
    if (!url) return '';
    return url.replace(/^https?:\/\/(www\.)?/, '');
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

  // Show success message if form was submitted successfully
  if (isClient && state.success && state.message) {
    return (
      <div className="w-full flex items-center justify-center min-h-[200px] bg-brand-teal rounded-sm md:px-3 p-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out">
        <div className="text-center">
          <p className="text-xl font-medium text-foreground">{state.message}</p>
          {state.referralLink && (
            <div className="mt-4 bg-muted rounded-md">
              <p className="text-sm text-brand-navy/75 mb-2">
                Share your referral link:
              </p>
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    id="copy-referral-link"
                    ref={copyButtonRef}
                    onClick={() => copyToClipboard(state.referralLink!)}
                    className="group relative w-full text-xs bg-background p-3 rounded border break-all text-brand-navy tracking-tight hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between gap-2"
                  >
                    <span className="flex-1 text-left">
                      {state.referralLink ? cleanUrl(state.referralLink) : ''}
                    </span>
                    <div className="flex-shrink-0">
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-brand-navy/60 group-hover:text-brand-navy transition-colors" />
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-brand-navy text-background">
                  {copied ? (
                    <p>Copied to clipboard!</p>
                  ) : (
                    <p>Copy</p>
                  )}
                </TooltipContent>
              </Tooltip>
              {/* <div className="h-4 mt-1 flex items-center bg-amber-300">
                {copied && (
                  <p className="text-xs text-green-600 animate-in fade-in-0 duration-300">
                    Copied to clipboard!
                  </p>
                )}
              </div> */}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="w-full flex flex-col items-stretch gap-3 animate-in fade-in-0 duration-300"
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
          const formatted = validateAndFormatPostCode(raw);
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
