import Countdown from "./count-down";
// import UserCounter from "./user-counter";


export default function SocialProof() {
  return (
    <div className=" w-full flex flex-row items-center justify-center md:justify-start">
      {/* <UserCounter waitlistSize={count} /> */}
      <Countdown />
    </div>
  );
}
