import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
  locale: string;
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
        "sm:text-5xl text-pretty tracking-wide",
        locale === "fa" ? "text-4xl font-thuluth" : "text-3xl font-stixTwoText",
        className
      )}
      {...props}
    >{children}</h1>
  );
};
