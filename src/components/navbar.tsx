import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import LocaleSwitcher from "./locale-switcher";
import { MaxWidthWrapper } from "./max-width-wrapper";
import MamanpazIcon from "@/../public/MamanpazIcon.svg";
import MamanpazWordmark from "@/../public/MamanpazWordmark.svg";

export default function Navbar() {
  // setRequestLocale(locale)
  const locale = useLocale();
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full bg-brand-navy backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div
          className={cn(
            "w-full flex h-16 items-center justify-between px-4",
            locale === "fa" ? " flex-row-reverse" : "flex-row"
          )}
        >
          <div
            className={cn(
              "h-full w-fit flex gap-1 items-center py-2",
              locale === "fa" ? " flex-row-reverse" : "flex-row"
            )}
          >
            {/* <MamanpazIcon className="h-full p-1 text-white md:h-12 block md:hidden" /> */}
            <MamanpazWordmark className="h-full text-white py-2 " />
          </div>
          <LocaleSwitcher />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
