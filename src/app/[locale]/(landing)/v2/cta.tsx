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
import { useTranslations } from "next-intl";
import { WaitlistForm } from "./waitlist-form";
import { WelcomeCard } from "./welcome-card";
import { useState } from "react";

export function CTA() {
  const t = useTranslations("CTA");
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ message: string; referralLink?: string } | null>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Don't reset success state when modal closes - keep it persistent
  };

  const handleSuccess = (data: { message: string; referralLink?: string }) => {
    setSuccessData(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          type="button"
          className="text-lg font-bold w-full"
        >
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${
        isSuccess ? "bg-brand-teal" : "bg-background"
      }`}>
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
          <WelcomeCard message={successData?.message} referralLink={successData?.referralLink} />
        )}
      </DialogContent>
    </Dialog>
  );
}
