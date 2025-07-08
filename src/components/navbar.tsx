import { useLocale } from "next-intl";
import MamanpazIcon from "../../public/MamanpazIcon.svg";
import MamanpazWordmark from "../../public/MamanpazWordmark.svg";
import LocaleSwitcher from "./locale-switcher";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    // setRequestLocale(locale)
    const locale = useLocale()
  return (
    <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full bg-brand-navy/90 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className={cn("flex h-16 items-center justify-between",
          locale === 'fa' ? ' flex-row-reverse' : 'flex-row'
        )}>
          <div className={cn("h-full w-fit flex gap-1 items-center py-2", 
            locale === 'fa' ? ' flex-row-reverse' : 'flex-row'
          )}>
            <MamanpazIcon className="h-full p-1 text-white md:h-12 block md:hidden" />
            <MamanpazWordmark className="h-full text-white hidden md:h-12 md:block" />
          </div>
          <LocaleSwitcher />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};
