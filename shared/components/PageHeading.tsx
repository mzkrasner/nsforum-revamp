import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

type Props = HTMLAttributes<HTMLHeadingElement> & { back?: string };
const PageHeading = ({ className = "", children, back, ...props }: Props) => {
  return (
    <h2
      className={cn(
        "mb-5 mt-8 flex items-center gap-1 text-2xl font-semibold",
        className,
      )}
      {...props}
    >
      {back && (
        <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" asChild>
          <Link href={back}>
            <ArrowLeftIcon size={18} />
          </Link>
        </Button>
      )}
      {children}
    </h2>
  );
};
export default PageHeading;
