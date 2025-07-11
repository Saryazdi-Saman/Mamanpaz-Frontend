import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { setRequestLocale } from "next-intl/server";
import MomSketchHero from "@/../public/MomSketchHero.svg";
import Image from 'next/image'
import { CopyBlock } from "./copy-block";
import { CTA } from "./cta";
import SocialProof from "./social-proof";
import sql from "@/utils/db";

export default async function V1({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;


  const waitlistQuery = await sql`
  select count(*) + 137 as count
  from users
  `;

  console.log(waitlistQuery)

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <section className="w-full min-h-[calc(100vh-4rem)] bg-brand-navy">
      <MaxWidthWrapper className="text-white min-h-[calc(100vh-4rem)] flex items-start md:items-center">
        <div
          data-type="hero-layout"
          className=" w-full flex flex-col-reverse items-center py-4 px-4 justify-start
          md:flex-row md:gap-16 md:justify-between
          landscape:py-4 landscape:gap-4"
        >
          <div
            data-type="copy-box"
            className="w-full h-fit space-y-8 bg-brand-navy/10 backdrop-blur-sm py-2
          md:w-3/5 lg:w-2/5 landscape:space-y-16"
          >
            <CopyBlock />
            <SocialProof count={waitlistQuery[0].count} />
            <CTA />
          </div>
          {/* <MomSketchHero className="h-52 w-auto max-h-80 md:w-2/5 md:h-auto md:max-h-none landscape:min-h-48 " /> */}
          <Image 
          src='/heroLine.png'
          alt="Sketch of a mom handing a plate of zereshk polo ba morgh to her child."
          width={1024}
          height={1536}
          className="h-52 w-auto max-h-80 md:w-2/5 md:h-auto md:max-h-none landscape:min-h-48 " 
          />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
