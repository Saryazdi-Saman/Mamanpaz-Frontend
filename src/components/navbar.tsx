import { Locale } from "next-intl";
import MamanpazIcon from "../../public/MamanpazIcon.svg";
import MamanpazWordmark from "../../public/MamanpazWordmark.svg";
import LocaleSwitcher from "./locale-switcher";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { setRequestLocale } from "next-intl/server";

export const Navbar = () => {
    // setRequestLocale(locale)
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full bg-brand-navy/80 backdrop-blur-lg transition-all md:h-20">
      <MaxWidthWrapper>
        <div className="flex h-full my-auto items-center justify-between">
          <div className="h-full w-fit flex gap-1 items-center">
            <MamanpazIcon className="h-10 text-white md:h-12" />
            <MamanpazWordmark className="h-10 text-white md:h-12" />
          </div>
          <LocaleSwitcher />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
