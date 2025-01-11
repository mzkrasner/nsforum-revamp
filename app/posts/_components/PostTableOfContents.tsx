import { Button } from "@/shared/components/ui/button";
import useOutsideClick from "@/shared/hooks/useOutsideClick";
import { cn } from "@/shared/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import usePost from "../_hooks/usePost";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const PostTableOfContents = ({ open, setOpen }: Props) => {
  const pathname = usePathname();

  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => {
    if (window?.matchMedia("(max-width: 768px)").matches) {
      setOpen(false);
    }
  });

  const {
    postQuery: { isLoading, data },
    postHeadings,
    activePostHeadingId,
  } = usePost();

  if (isLoading) return "Loading...";
  if (!data) return "No data found...";
  const { title } = data;

  return (
    <div
      ref={ref}
      className={cn(
        "scrollbar-hide fixed bottom-7 right-3 z-[5] max-h-[calc(100vh_-_100px)] max-w-[calc(100vw_-_24px)] overflow-y-auto rounded-md p-5 pt-5 md:static md:mb-[132px] md:max-h-[unset] md:w-[280px] md:max-w-[unset] md:overflow-visible md:border-none md:px-0 md:pt-0",
        {
          "md:w-0": !open,
          "border border-neutral-300 bg-white": open,
        },
      )}
    >
      <div className="sticky top-[108px] flex h-fit flex-col-reverse md:block">
        {
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-[calc(50vh-50px)] hidden -translate-y-1/2 text-neutral-500 md:flex"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronLeftIcon size={26} strokeWidth={1.5} />
            ) : (
              <ChevronRightIcon size={26} strokeWidth={1.5} />
            )}
          </Button>
        }
        {!open && (
          <div className="fixed bottom-10 right-5 block h-fit w-fit md:hidden">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOpen(true)}
            >
              <ListIcon size={14} />
            </Button>
          </div>
        )}
        {open && (
          <div className="text-sm">
            <h3 className="mb-3 font-serif text-base font-medium uppercase">
              {title}
            </h3>
            <ul className="text-neutral-500">
              {postHeadings.map((postHeading, index) => {
                const { level, id, textContent } = postHeading;
                return (
                  <li key={index}>
                    <Link
                      href={`${pathname}/#${id}`}
                      className={cn(
                        "link block cursor-pointer py-1 hover:text-neutral-900",
                        {
                          "font-medium text-neutral-900":
                            activePostHeadingId === id,
                        },
                      )}
                      style={{
                        paddingLeft: `${Math.max((level - 2) * 16, 0)}px`,
                      }}
                    >
                      {textContent}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostTableOfContents;
