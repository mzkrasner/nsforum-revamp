import { cn } from "@/shared/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Youtube from "@tiptap/extension-youtube";
import { AnyExtension, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useState } from "react";
import { FieldError, RefCallBack } from "react-hook-form";
import { Markdown } from "tiptap-markdown";
import ComponentMenus from "./components/ComponentMenus";
import MdEditor from "./components/MdEditor";
import Toolbar from "./components/Toolbar";
import { EditorContext } from "./context";
import Iframe from "./plugins/iframe";
import { MdEditorType, MdNodeType } from "./types";

type Props = {
  onChange?: (richText: string) => void;
  value?: string;
  className?: string;
  limit?: number;
  hideToolbar?: boolean;
  placeholder?: string;
  error?: FieldError;
  uploadImage?: (formData: FormData) => Promise<string | null | undefined>;
};
const RichTextEditor = forwardRef<HTMLDivElement, Props>(
  (
    {
      onChange,
      value = "",
      className = "",
      limit,
      hideToolbar = false,
      placeholder = "",
      error,
      uploadImage,
    }: Props,
    forwardedRef,
  ) => {
    const [isMdEditorActive, setIsMdEditorActive] = useState(false);
    const [mdEditor, setMdEditor] = useState<MdEditorType | null>(null);
    const [mdActiveNodeTypes, setMdActiveNodeTypes] = useState<MdNodeType[]>(
      [],
    );
    const [focused, setFocused] = useState(false);

    const hasLimit = !isNaN(Number(limit));

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3, 4, 5, 6],
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: {
            class: "link",
          },
        }),
        Image,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        hasLimit
          ? CharacterCount.configure({
              limit,
            })
          : null,
        Youtube.configure({
          controls: true,
          nocookie: true,
          HTMLAttributes: {
            style:
              "margin: 0 auto; width: 100%; max-width: 640px; height: auto; aspect-ratio: 16/9; border-radius: 8px",
          },
        }),
        Iframe,
        Markdown,
      ].filter((v) => !!v) as AnyExtension[],
      content: value || "",
      editorProps: {
        attributes: {
          class: "p-3 min-h-full flex-1 pb-6 outline-none focus:border-gray-9",
        },
      },
      onUpdate({ editor }) {
        onChange && onChange(editor.getHTML());
      },
      immediatelyRender: false,
    });

    // Update the editor's content when the state changes
    useEffect(() => {
      if (editor && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    useEffect(() => {
      if (!isMdEditorActive && mdEditor) setMdEditor(null);
    }, [isMdEditorActive, mdEditor]);

    const toggleMarkdown = () => {
      if (isMdEditorActive) {
        editor?.commands.setContent(mdEditor?.view?.state.doc.toString() || "");
      }
      setIsMdEditorActive(!isMdEditorActive);
    };

    const charsLeft = hasLimit
      ? limit! - editor?.storage.characterCount.characters()
      : null;

    return (
      <EditorContext.Provider
        value={{
          editor,
          uploadImage,
          isMdEditorActive,
          toggleMarkdown,
          mdEditor,
          setMdEditor,
          mdActiveNodeTypes,
          setMdActiveNodeTypes,
        }}
      >
        <div
          tabIndex={0}
          ref={(e) => {
            if (typeof forwardedRef === "function") {
              (forwardedRef as RefCallBack)(e);
            }
          }}
          className={cn(
            "border-gray-1 relative flex h-fit flex-col rounded-md border",
            {
              "border-black outline-none ring-2 ring-ring ring-offset-2":
                focused,
              ["border-destructive"]: !!error,
            },
            className,
          )}
        >
          {!hideToolbar && <Toolbar />}
          {isMdEditorActive && <MdEditor />}
          <EditorContent
            editor={editor}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn("flex flex-1 flex-col", {
              "-z-1 pointer-events-none h-0 w-0 flex-[0] opacity-0":
                isMdEditorActive,
            })}
          />
          <ComponentMenus />
          {hasLimit && (
            <span className="text-gray-5 absolute bottom-1 right-2 text-sm">
              {charsLeft} charaters left
            </span>
          )}
        </div>
      </EditorContext.Provider>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
