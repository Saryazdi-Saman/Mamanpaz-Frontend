"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WelcomeCardProps {
  referralLink?: string;
  message?: string;
}

export function WelcomeCard({ referralLink, message }: WelcomeCardProps) {
  const t = useTranslations("WaitlistForm");
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[200px] animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out">
      <div className="text-center">
        <p className="text-xl font-medium text-foreground">
          {message ? t(message) : t("success")}
        </p>
        {referralLink && (
          <div className="mt-4 bg-muted rounded-md">
            <p className="text-sm text-brand-navy/75 mb-2">
              {t("shareText")}
            </p>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  id="copy-referral-link"
                  onClick={() => copyToClipboard(referralLink)}
                  className="group relative w-full text-sm bg-background/75 p-3 rounded border border-primary break-all text-brand-navy hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between gap-2"
                >
                  <span className="flex-1 text-left">
                    {cleanUrl(referralLink)}
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
                {copied ? <p>{t("copied")}</p> : <p>{t("copy")}</p>}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}