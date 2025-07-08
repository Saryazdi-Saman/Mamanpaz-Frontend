import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import MomSketchHero from '@/../public/MomSketchHero.svg'
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
        <div data-type="copy-box" className=" w-full h-full flex flex-col-reverse items-center py-5 px-4 justify-evenly font-light">
          <div className="w-full h-fit space-y-8">
            <CopyBlock />
            <CTA />
          </div>
          <MomSketchHero className="h-2/5"/>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
