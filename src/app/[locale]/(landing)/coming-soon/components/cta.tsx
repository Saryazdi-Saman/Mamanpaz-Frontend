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
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { WaitlistForm } from "./waitlist-form";
import { WelcomeCard } from "./welcome-card";

interface CTAProps {
  variant?: string;
}

export function CTA({ variant }: CTAProps) {
  const t = useTranslations("CTA");
  const locale = useLocale();

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

  const version = variant || "unknown";

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
          <WaitlistForm setIsSuccess={setIsSuccess} onSuccess={handleSuccess} variant={variant} />
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
