import Countdown from "./count-down";
import UserCounter from "./user-counter";

export default function SocialProof({ count }: { count: number }) {
  return (
    <div className=" w-full flex flex-row items-center justify-start">
      <UserCounter waitlistSize={count} />
      <Countdown />
    </div>
  );
}
