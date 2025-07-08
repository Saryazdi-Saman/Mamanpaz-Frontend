import { routing } from "@/i18n/routing";
import { Locale, hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "./../globals.css";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {Vazirmatn, STIX_Two_Text, Lato} from 'next/font/google'
import localFont from 'next/font/local'
import { Metadata } from "next";

const stixTwoText = STIX_Two_Text({
  subsets: ['latin'],
  variable: "--font-stix-two-text",
  display: "swap"
})

const lato = Lato({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['100', '400', '700'],
  variable: "--font-lato",
  display: "swap"
})

const decoTypeThuluth = localFont({
  src: '../../../public/decotype_thuluth_regular.woff2',
  variable: '--font-decotype-thuluth',
  display: 'swap'
})

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
})



type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: Omit<Props, "children">):Promise<Metadata> {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: t("title"),
    applicationName: 'Mamanpaz',
    appleWebApp: {
      title: 'Mamanpaz'
    },

  };
}

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Determine font classes based on locale
  // const fontClasses =  `${decoTypeThuluth.variable} ${vazirmatn.variable} ${stixTwoText.variable} ${lato.variable}`

  const bodyFont = locale === "fa" ? 'font-vazir' : 'font-lato'
  const fontClasses = locale === "fa" 
    ? `${decoTypeThuluth.variable} ${vazirmatn.variable}`
    : `${stixTwoText.variable} ${lato.variable} ${decoTypeThuluth}`;


  return (
    <html className="h-full" lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body className={`${fontClasses} ${bodyFont} flex h-full flex-col antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
