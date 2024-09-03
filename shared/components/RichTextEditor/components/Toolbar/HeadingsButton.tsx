import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Toggle } from "@/shared/components/ui/toggle";
import { Level } from "@tiptap/extension-heading";
import { useCurrentEditor } from "@tiptap/react";
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
  if (!editor) return null;

  const toggleHeading = (level: Level) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Toggle size="sm" className="h-8 w-8">
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
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHeading(level);
                }}
                pressed={editor.isActive("heading", { level })}
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
