"use client";

import { getTimeUntilLaunch } from "@/lib/time-until-launch";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PiCallBell } from "react-icons/pi";

export default function Countdown() {
  const t = useTranslations("SocialProof");
  const [time, setTime] = useState(getTimeUntilLaunch());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilLaunch());
    }, 60_000); // update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div data-type="count-down" className="flex items-center gap-2 w-1/2">
      <PiCallBell className="text-4xl text-white/75" />
      <p className="text-pretty leading-4 text-sm font-lato">
        {t("countdown")}
        <br />
        {t("timerFormat", { day: time.days, hour: time.hours })}
      </p>
    </div>
  );
}
