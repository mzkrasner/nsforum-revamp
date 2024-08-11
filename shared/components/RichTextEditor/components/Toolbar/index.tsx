"use client";

import { Toggle } from "@/shared/components/ui/toggle";
import { useCurrentEditor } from "@tiptap/react";
import { BoldIcon, ItalicIcon, ListIcon, ListOrderedIcon } from "lucide-react";
import TableButton from "./TableButton";

const TipTapToolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="border-gray-1 flex items-center gap-1 border-b p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletlist")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Toggle>
      <span className="ml-auto"></span>
      <TableButton />
    </div>
  );
};
export default TipTapToolbar;
