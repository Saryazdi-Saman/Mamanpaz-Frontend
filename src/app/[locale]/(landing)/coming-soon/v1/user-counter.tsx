"use client";

import { useTranslations } from "next-intl";
import { TbFriends } from "react-icons/tb";

export default function UserCounter({
  waitlistSize,
}: {
  waitlistSize: number;
}) {
  const t = useTranslations("SocialProof");

  return (
    <div data-type="memebers" className="flex items-center gap-2 w-1/2">
      <TbFriends className="text-4xl text-white/75" />
      <p className="text-pretty leading-4 text-sm font-lato">
        {t("memberCount", { count: waitlistSize })} <br /> {t("members")}
      </p>
    </div>
  );
}
