import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Toggle } from "@/shared/components/ui/toggle";
import { cn } from "@/shared/lib/utils";
import { Level } from "@tiptap/extension-heading";
import {
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  HeadingIcon,
} from "lucide-react";
import { useState } from "react";
import useEditorContext from "../../hooks/useEditorContext";
import useToolbarFunctions from "./useToolbarFunctions";

const headingIcons = [
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
] as const;

const HeadingsButton = () => {
  const [open, setOpen] = useState(false);

  const { editor } = useEditorContext();
  const { toggleHeading, isHeadingActive, isAnyHeadingActive } =
    useToolbarFunctions();

  if (!editor) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Toggle
          size="sm"
          className={cn("h-8 w-8", { "bg-neutral-100": isAnyHeadingActive() })}
        >
          <HeadingIcon size={16} />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit p-1">
        {headingIcons.map((Icon, index) => {
          const level = (index + 2) as Level;
          return (
            <DropdownMenuItem key={index} asChild>
              <Toggle
                size="sm"
                className="w-full gap-2"
                onClick={(e) => e.stopPropagation()}
                onPressedChange={() => toggleHeading(level)}
                pressed={isHeadingActive(level)}
              >
                <Icon size={16} />
                Heading {level}
              </Toggle>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default HeadingsButton;
