import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export const CTA = () => {
  const t = useTranslations("CTAv1");

  return (
    <div
      className="
      w-full flex flex-col items-stretch gap-2
    md:w-fit"
    >
      <p>
        {t("announcement", {
          day: 40,
          hour: 18,
        })}
      </p>
      <p className="text-pretty">{t("hook", { count: 274 })}</p>
      <div className="flex gap-2">
        <Input
          className="w-2/3 border-brand-teal ring-brand-teal selection:text-brand-navy  text-background selection:bg-brand-teal"
          type="text"
          placeholder="Name"
        />
        <Input
          className="w-1/3  border-brand-teal ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
          type="text"
          placeholder="Postal Code"
        />
      </div>
      <Input
        type="tel"
        className=" border-brand-teal ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
        placeholder="Phone number"
      />
      <Button size="lg" className="text-lg font-bold h-11">
        {t("button")}
      </Button>
      <div className="text-sm opacity-70 tracking-wide"></div>
    </div>
  );
};
