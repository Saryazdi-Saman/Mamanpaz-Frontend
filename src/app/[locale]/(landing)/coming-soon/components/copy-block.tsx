import { Heading } from "@/components/heading";
import { useLocale, useTranslations } from "next-intl";

export const CopyBlock = () => {
  const t = useTranslations("PracticalCopy");
  const locale = useLocale();

  return (
    <div className="space-y-3 text-center md:text-start">
      <div >
        {locale !== "fa" && (
          <p dir="rtl" className="font-thuluth text-3xl text-center">
            خبری خوش در راه است...
          </p>
        )}
        <Heading locale={locale}>
          {t.rich("header", {
            nosplit: (chunks) => (
              <span className="whitespace-nowrap">{chunks}</span>
            ),
          })}
        </Heading>
      </div>
      <p className="text-pretty text-lg font-normal md:font-light md:tracking-wider">
        {t.rich("subheader", {
          br: () => <br></br>,
        })}
      </p>
    </div>
  );
};
