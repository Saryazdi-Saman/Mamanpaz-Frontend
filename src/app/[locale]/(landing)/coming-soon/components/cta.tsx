"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { WaitlistForm } from "./waitlist-form";
import { WelcomeCard } from "./welcome-card";
import { useState } from "react";

export function CTA() {
  const t = useTranslations("CTA");
  const locale = useLocale();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    referralLink?: string;
  } | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Don't reset success state when modal closes - keep it persistent
  };

  const handleSuccess = (data: { message: string; referralLink?: string }) => {
    setSuccessData(data);
  };

  let version = "unknown path";

  if (pathname.includes("/insider")) {
    version = "dev team";
  } else if (pathname.includes("/v1")) {
    version = "V1";
  } else if (pathname.includes("/v2")) {
    version = "V2";
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          id="join-btn"
          size="lg"
          type="button"
          data-umami-event="Join button"
          data-umami-event-version={version}
          data-umami-event-language={locale}
          className="text-lg font-bold w-full"
        >
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[425px] ${
          isSuccess ? "bg-brand-teal" : "bg-background"
        }`}
      >
        <DialogHeader>
          {!isSuccess ? (
            <>
              <DialogTitle>{t("dialogTitle")}</DialogTitle>
              <DialogDescription>{t("dialogDescription")}</DialogDescription>
            </>
          ) : (
            <DialogTitle className="text-center text-2xl">🎉 🎉 🎉</DialogTitle>
          )}
        </DialogHeader>
        {!isSuccess ? (
          <WaitlistForm setIsSuccess={setIsSuccess} onSuccess={handleSuccess} />
        ) : (
          <WelcomeCard
            message={successData?.message}
            referralLink={successData?.referralLink}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
