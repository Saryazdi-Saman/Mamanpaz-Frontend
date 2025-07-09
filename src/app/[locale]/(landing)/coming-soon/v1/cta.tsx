import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export const CTA = () => {
  const t = useTranslations("CTAv1");

  return (
    <div
      className="
      w-full flex flex-col items-stretch gap-2
    md:w-fit"
    >
      <p className="text-sm opacity-70">{t("hook", { count: 274 })}</p>
      <Button size="lg" className="text-lg font-bold h-11">{t("button")}</Button>
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
