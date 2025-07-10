import { useTranslations } from "next-intl";
import Countdown from "./count-down";
import UserCounter from "./user-counter";

export default function SocialProof({ count }: { count: number }) {
  const t = useTranslations("SocialProof");
  return (
    <div className=" w-full flex flex-row items-center justify-start">
      <UserCounter waitlistSize={count} />
      <Countdown />
    </div>
  );
}
