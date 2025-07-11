import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import sql from "@/utils/db";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { CopyBlock } from "../components/copy-block";
import { CTA } from "../components/cta";
import SocialProof from "../components/social-proof";

export default async function ComingSoonV1({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const waitlistQuery = await sql`
  select count(*) + 137 as count
  from users
  `;

  console.log(waitlistQuery);

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <section className="w-full min-h-[calc(100vh-4rem)] bg-brand-navy">
      <MaxWidthWrapper className="text-white min-h-[calc(100vh-4rem)] flex items-start md:items-center">
        <div
          data-type="hero-layout"
          className=" w-full flex flex-col-reverse items-center px-1 md:px-4 justify-start
          md:flex-row md:gap-16 md:justify-between md:py-4
          landscape:py-4 landscape:gap-4"
        >
          <div
            data-type="copy-box"
            className="w-full h-fit space-y-8 bg-brand-navy py-4 z-20 md:py-2
          md:w-3/5 lg:w-2/5 landscape:space-y-16 -mt-8 md:mt-0"
          >
            <CopyBlock variant="v1" />
            <SocialProof count={waitlistQuery[0].count} variant="v1" />
            <CTA variant="v1" />
          </div>
          <Image
            src="/MomSketchHero.webp"
            alt="Sketch of a mom handing a plate of zereshk polo ba morgh to her child."
            priority
            width={1024}
            height={1536}
            className="h-72 w-auto max-h-80 md:w-2/5 md:h-auto md:max-h-none landscape:min-h-48 z-10 bg-brand-navy"
          />
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
