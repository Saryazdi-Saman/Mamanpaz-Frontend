'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPhoneNumberInput } from "@/lib/format-phone-number-input";
import { normalizeDigits } from "@/lib/normalize-digits";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const CTA = () => {
  const t = useTranslations("WaitlistForm");

  const [phoneInput, setPhoneInput] = useState("")

  return (
    <form
      className=" w-full flex flex-col items-stretch gap-3 "
      autoComplete="on"
    >
      {/* <p className="text-pretty text-lg tracking-normal pb-0.5 font-normal">{t("hook")}</p> */}
      {/* <div className="flex gap-2"> */}
      <Input
        id="name"
        name="name"
        placeholder={t("name")}
        required
        minLength={3}
        maxLength={150}
        autoComplete="name"
        className="ring-brand-teal selection:text-background text-background selection:bg-brand-teal"
        type="text"
      />
      <Input
        id="zip"
        name="zip"
        placeholder={t("postCode")}
        required
        minLength={6}
        maxLength={6}
        autoComplete="postal-code"
        className="ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
        type="text"
      />
      {/* </div> */}
      <Input
        id="phone"
        name="phone"
        placeholder={t("phone")}
        value={formatPhoneNumberInput(phoneInput)}
        required
        title={t("phoneValidation")}
        inputMode="numeric"
        translate="no"
        pattern="^\(\d{3}\) \d{3}-\d{4}$"
        autoComplete="tel"
        type="tel"
        onInput={(e) => {
          const raw = e.currentTarget.value; 
          const normalized = normalizeDigits(raw); // convert farsi and arabic fonts to latin digits
          const value = normalized.replace(/\D/g, ""); // remove all none numeric chars
          setPhoneInput(value)
        }}
        className=" ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
      />
      <Button size="lg" className="text-lg font-bold h-14">
        {t("button")}
      </Button>
      <div className="text-sm opacity-70 tracking-wide"></div>
    </form>
  );
};
