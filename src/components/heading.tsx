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
  return (
    <h1
      className={cn(
        "text-pretty tracking-wide",
        locale === "fa" ? "text-4xl font-thuluth md:text-5xl" : "text-3xl font-stixTwoText md:text-4xl",
        className
      )}
      {...props}
    >{children}</h1>
  );
};
