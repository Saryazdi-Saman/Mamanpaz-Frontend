import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export const CTA = () => {
  const t = useTranslations("CTAv1");

  return (
    <div
      className=" w-full flex flex-col items-stretch gap-3 "
    >
      {/* <p className="text-pretty text-lg tracking-normal pb-0.5 font-normal">{t("hook")}</p> */}
      {/* <div className="flex gap-2"> */}
        <Input
          className="ring-brand-teal selection:text-background text-background selection:bg-brand-teal"
          type="text"
          placeholder="Name"
        />
        <Input
          className="ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
          type="text"
          placeholder="Postal Code"
        />
      {/* </div> */}
      <Input
        type="tel"
        className=" ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
        placeholder="Phone number"
      />
      <Button size="lg" className="text-lg font-bold h-14">
        {t("button")}
      </Button>
      <div className="text-sm opacity-70 tracking-wide"></div>
    </div>
  );
};
