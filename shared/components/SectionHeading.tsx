import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

const SectionHeading = ({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn("mb-3 mt-6 text-xl font-semibold", className)}
      {...props}
    >
      {children}
    </h3>
  );
};
export default SectionHeading;
