"use client";

import { useTranslations } from "next-intl";
import { PiCallBell } from "react-icons/pi";

export default function Countdown() {
  const t = useTranslations("SocialProof");

  return (
    <div data-type="count-down" className="flex items-center gap-2 w-fit text-white/75">
      <PiCallBell className="text-2xl" />
      <p className="text-pretty">
        {t("launchDateLabel")}: {t("launchDate")}
      </p>
    </div>
  );
}
