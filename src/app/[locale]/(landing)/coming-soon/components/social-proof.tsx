import Countdown from "./count-down";
import UserCounter from "./user-counter";

interface SocialProofProps {
  count: number;
  variant?: string;
}

export default function SocialProof({ count, variant }: SocialProofProps) {
  return (
    <div className=" w-full flex flex-row items-center justify-start">
      <UserCounter waitlistSize={count} />
      <Countdown />
    </div>
  );
}
