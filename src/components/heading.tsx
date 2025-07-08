import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  locale: (typeof routing.locales)[number];
}

export const Heading = ({
  children,
  className,
  locale,
  ...props
}: HeadingProps) => {
  const fontFamily = {
    fa: "font-thuluth",
    en: "font-stixTwoText",
  };
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl text-pretty tracking-wide",
        className
      )}
      {...props}
    >{children}</h1>
  );
};
