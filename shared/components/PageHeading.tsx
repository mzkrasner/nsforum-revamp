import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

const PageHeading = ({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn("mb-5 mt-8 text-2xl font-semibold", className)}
      {...props}
    >
      {children}
    </h2>
  );
};
export default PageHeading;
