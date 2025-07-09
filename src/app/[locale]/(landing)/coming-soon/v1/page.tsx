import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import MomSketchHero from "@/../public/MomSketchHero.svg"

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
  return (
    <section className="w-full min-h-screen bg-brand-navy">
      <MaxWidthWrapper className="text-white min-h-screen flex items-center">
        <div
          data-type="hero-layout"
          className=" w-full flex flex-col-reverse items-center py-8 px-4 justify-center gap-8
          md:flex-row md:gap-16 md:justify-between
          landscape:py-4 landscape:gap-4"
        >
          <div data-type="copy-box" className="w-full h-fit space-y-8
          md:w-3/5 landscape:space-y-4">
            <CopyBlock />
            <CTA />
          </div>
          <MomSketchHero className="h-64 w-auto max-h-80 md:w-2/5 md:h-auto md:max-h-none landscape:min-h-48 " />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
