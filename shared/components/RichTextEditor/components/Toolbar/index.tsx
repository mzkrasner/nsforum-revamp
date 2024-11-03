"use client";

import { Toggle } from "@/shared/components/ui/toggle";
import { cn } from "@/shared/lib/utils";
import { SiMarkdown } from "@icons-pack/react-simple-icons";
import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon } from "lucide-react";
import useEditorContext from "../../hooks/useEditorContext";
import HeadingsButton from "./HeadingsButton";
import InsertButtons from "./InsertButtons";
import useToolbarFunctions from "./useToolbarFunctions";

const TipTapToolbar = () => {
  const { editor, isMdEditorActive, toggleMarkdown } = useEditorContext();
  const {
    toggleBold,
    toggleItalic,
    toggleBulletedList,
    toggleOrderedList,
    isBoldActive,
    isItalicActive,
    isBulletedListActive,
    isOrderedListActive,
  } = useToolbarFunctions();
  if (!editor) return null;

  return (
    <div className="border-gray-1 sticky top-20 z-[1] flex items-center gap-1 border-b bg-white p-1">
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={isBoldActive()}
        onPressedChange={toggleBold}
      >
        <BoldIcon size={14} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={isItalicActive()}
        onPressedChange={toggleItalic}
      >
        <ItalicIcon size={14} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={isBulletedListActive()}
        onPressedChange={toggleBulletedList}
      >
        <ListIcon size={14} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={isOrderedListActive()}
        onPressedChange={() => toggleOrderedList()}
      >
        <ListOrderedIcon size={14} />
      </Toggle>
      <HeadingsButton />
      <span className="ml-auto"></span>
      <InsertButtons />
      <Toggle
        size="sm"
        className="h-8 w-8 p-0"
        pressed={isMdEditorActive}
        onPressedChange={toggleMarkdown}
      >
        <SiMarkdown
          size={20}
          className={cn({
            "opacity-30": !isMdEditorActive,
          })}
        />
      </Toggle>
    </div>
  );
};
export default TipTapToolbar;
