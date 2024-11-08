"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { BubbleMenu } from "@tiptap/react";
import { ExternalLinkIcon, TrashIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import useEditorContext from "../../hooks/useEditorContext";
import useToolbarInsertFunctions from "../Toolbar/useToolbarInsertFunctions";

const LinkMenu = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { editor } = useEditorContext();

  const [newUrl, setNewUrl] = useState("");

  const href = useMemo(() => {
    return editor?.getAttributes("link").href;
  }, [editor?.getAttributes("link").href]);

  const { setLink, unsetLink } = useToolbarInsertFunctions();

  useEffect(() => {
    if (!href) return;

    setNewUrl(href);
  }, [href]);

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        onHide: () => {
          setNewUrl("");
        },
        onShow: () => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        },
      }}
      shouldShow={({ editor, state }) => {
        return editor.isActive("link");
      }}
    >
      <div className="relative flex justify-center overflow-hidden rounded-md">
        <Input
          ref={inputRef}
          className="border-2 border-neutral-800 pr-36"
          value={newUrl || ""}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-end gap-2 pl-2 pr-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setLink(newUrl)}
            disabled={href === newUrl}
          >
            Apply
          </Button>
          {href && (
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <a rel="noopener noreferrer" target="_blank" href={href}>
                <ExternalLinkIcon size={16} />
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => unsetLink()}
          >
            <TrashIcon size={16} />
          </Button>
        </div>
      </div>
    </BubbleMenu>
  );
};
export default LinkMenu;
