import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("HomePage");
  return (
    <div>
      <MaxWidthWrapper>
        <h1>{t("title")}</h1>
        <Link href="/about">{t("about")}</Link>
      </MaxWidthWrapper>
    </div>
  );
}
