"use client";

import { Toggle } from "@/shared/components/ui/toggle";
import { useCurrentEditor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon } from "lucide-react";
import HeadingsButton from "./HeadingsButton";
import TableButton from "./TableButton";

const TipTapToolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="border-gray-1 flex items-center gap-1 border-b p-1">
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon size={14} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon size={14} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={editor.isActive("bulletlist")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon size={14} />
      </Toggle>
      <Toggle
        size="sm"
        className="h-8 w-8"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon size={14} />
      </Toggle>
      <HeadingsButton />
      <span className="ml-auto"></span>
      <TableButton />
    </div>
  );
};
export default TipTapToolbar;
