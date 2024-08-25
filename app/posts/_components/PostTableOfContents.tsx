import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ArrowLeftIcon, ListIcon } from "lucide-react";
import usePost from "../_hooks/usePost";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const PostTableOfContents = ({ open, setOpen }: Props) => {
  const {
    postQuery: { isLoading, data },
    postHeadings,
    activePostHeadingId,
  } = usePost();

  if (isLoading) return "Loading...";
  if (!data) return "No data found...";
  const { title } = data;

  const scrollToHeading = (headingId: string) => {
    const headingElement = document.getElementById(headingId);
    if (!headingElement) return;

    // Calculate the scroll position
    const yOffset = -20; // Offset by 20px from the top
    const y =
      headingElement.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (!open)
    return (
      <Button
        variant="secondary"
        size="icon"
        className="fixed left-8 top-[100px] h-8 w-8"
        onClick={() => setOpen(true)}
      >
        <ListIcon size={14} />
      </Button>
    );

  return (
    <div className="pr-5">
      <div className="sticky top-10 h-fit">
        <div className="mb-2 pb-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(false)}
          >
            <ArrowLeftIcon size={14} />
          </Button>
        </div>
        <h3 className="mb-3 font-serif text-base">{title}</h3>
        <ul className="text-sm text-neutral-500">
          {postHeadings.map((postHeading, index) => {
            const { level, id, textContent } = postHeading;
            return (
              <li
                key={index}
                className={cn(
                  "h-7 cursor-pointer leading-7 hover:text-neutral-900",
                  {
                    "font-medium text-neutral-900": activePostHeadingId === id,
                  },
                )}
                style={{ paddingLeft: `${Math.max((level - 2) * 16, 0)}px` }}
                onClick={() => scrollToHeading(id)}
              >
                {textContent}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default PostTableOfContents;
