"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface WelcomeCardProps {
  referralLink?: string;
  message?: string;
  variant?: string;
}

export function WelcomeCard({ referralLink, message, variant }: WelcomeCardProps) {
  const t = useTranslations("WaitlistForm");
  const locale = useLocale();

  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Use passed variant as the single source of truth
  const version = variant || "unknown";

  const cleanUrl = (url: string) => {
    if (!url) return "";
    return url.replace(/^https?:\/\/(www\.)?/, "");
  };

  const copyToClipboard = async (text: string) => {
    try {
      // Check if clipboard API is available
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // Use deprecated execCommand with proper error handling
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Fallback copy method failed');
        }
      }
      
      setCopied(true);
      setTooltipOpen(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Could show user-facing error message here if needed
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[150px] animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out">
      <div className="text-center">
        <p className="text-xl font-medium text-foreground">
          {message ? t.rich(message, {
            br: () => <br></br>
          }) : t.rich("success", {
            br: () => <br></br>
          })}
        </p>
        {referralLink && (
          <div className="mt-4 bg-muted rounded-md">
            <p className="text-sm text-brand-navy/75 mb-2">{t("shareText")}</p>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  id="copy-referral-link"
                  data-umami-event="Copy referral"
                  data-umami-event-version={version}
                  data-umami-event-language={locale}
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
