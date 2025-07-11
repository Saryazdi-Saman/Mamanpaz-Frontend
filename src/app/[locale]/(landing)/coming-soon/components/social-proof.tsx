import Countdown from "./count-down";
import UserCounter from "./user-counter";

interface SocialProofProps {
  count: number;
}

export default function SocialProof({ count }: SocialProofProps) {
  return (
    <div className=" w-full flex flex-row items-center justify-start">
      <UserCounter waitlistSize={count} />
      <Countdown />
    </div>
  );
}
