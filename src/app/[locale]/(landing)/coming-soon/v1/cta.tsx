import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export const CTA = () => {
  const t = useTranslations("CTAv1");

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
          className="ring-brand-teal selection:text-background text-background selection:bg-brand-teal"
          type="text"
        />
        <Input
          id='zip'
          name='zip'
          required
          minLength={6}
          maxLength={6}
          placeholder={t("postCode")}
          className="ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
          type="text"
        />
      {/* </div> */}
      <Input
        id='phone'
        name='phone'
        required
        placeholder={t("phone")}
        type="tel"
        className=" ring-brand-teal selection:text-background  text-background selection:bg-brand-teal"
      />
      <Button size="lg" className="text-lg font-bold h-14">
        {t("button")}
      </Button>
      <div className="text-sm opacity-70 tracking-wide"></div>
    </form>
  );
};
