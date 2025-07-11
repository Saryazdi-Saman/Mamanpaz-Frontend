import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import sql from "@/utils/db";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { CopyBlock } from "../components/copy-block";
import SocialProof from "../components/social-proof";
import { CTA } from "../components/cta";

export default async function ComingSoonV2({
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
      {/* Mobile Layout */}
      <div className="md:hidden landscape:hidden">
        <div className="relative w-full h-80 overflow-hidden">
          <Image
            src="/hero.webp"
            alt="A dinner table covered with persian food."
            priority
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-navy"></div>
        </div>
        <MaxWidthWrapper className="text-white">
          <div className="px-1 pb-8 -mt-5">
            <div className="w-full space-y-8 bg-brand-navy/90 backdrop-blur-sm rounded-lg">
              <CopyBlock variant="v2" />
              <SocialProof count={waitlistQuery[0].count} variant="v2" />
              <CTA variant="v2" />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Desktop/Landscape Layout */}
      <div className="hidden md:block landscape:block relative min-h-[calc(100vh-4rem)]">
        <Image
          src="/hero.webp"
          alt="A dinner table covered with persian food."
          priority
          fill
          className="object-cover object-center"
        />
        <MaxWidthWrapper className="relative z-10 text-white min-h-[calc(100vh-4rem)] flex items-center">
          <div className="w-2/5 space-y-8 bg-brand-navy/80 backdrop-blur-md p-8 rounded-lg">
            <CopyBlock variant="v2" />
            <SocialProof count={waitlistQuery[0].count} variant="v2" />
            <CTA variant="v2" />
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
