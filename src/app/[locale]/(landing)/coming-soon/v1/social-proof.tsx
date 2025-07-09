import { useTranslations } from "next-intl";
import { TbFriends } from "react-icons/tb";
import { PiCallBell } from "react-icons/pi";

export default function SocialProof() {
  const t = useTranslations("SocialProof");

  return (
    <div
      className=" w-full flex flex-row items-center justify-start"
    >
      <div data-type="memebers" className="flex items-end gap-2 text-sm w-1/2">
        <TbFriends className="text-4xl" />
        <div>
          <p className="text-pretty">{t("memberCount", {count: 274})}</p>
          <p className="text-pretty">{t("members")}</p>
        </div>
      </div>
      <div data-type="count-down" className="flex items-end gap-2 text-sm w-1/2">
        <PiCallBell className="text-4xl" />
        <div>
          <p className="text-pretty">{t("countdown")}</p>
          <p className="text-pretty">
            {t("timerFormat", { day: 35, hour: 14 })}
          </p>
        </div>
      </div>
    </div>
  );
}
