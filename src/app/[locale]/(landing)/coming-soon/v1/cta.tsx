import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

export const CTA = () => {
  const locale = useLocale();
  const t = useTranslations("CTAv1");

  return (
    <div className="w-full flex flex-col items-stretch gap-2">
        <p className="text-sm opacity-70">{t("hook", { count: 274 })}</p>
            <Button >{t("button")}</Button>
      <div className="text-sm opacity-70 tracking-wide">
        <p>
          {t("announcement", {
            day: 40,
            hour: 18,
          })}
        </p>
      </div>
    </div>
  );
};
