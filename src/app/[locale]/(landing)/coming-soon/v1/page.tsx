import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import MomSketchHero from "@/../public/MomSketchHero.svg";
import { CopyBlock } from "./copy-block";
import { CTA } from "./cta";

export default function V1({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Enable static rendering
  setRequestLocale(locale);

  const t = useTranslations("HomePage");
  return (
    <section className="w-full h-svh bg-brand-navy">
      <MaxWidthWrapper className="text-white">
        <div
          data-type="hero-layout"
          className=" w-full h-full flex flex-col-reverse items-center py-5 px-4 justify-evenly
          md:flex-row md:gap-16"
        >
          <div data-type="copy-box" className="w-full h-fit space-y-8
          md:w-3/5">
            <CopyBlock />
            <CTA />
          </div>
          <MomSketchHero className="h-2/5 md:w-2/5 md:h-auto" />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
