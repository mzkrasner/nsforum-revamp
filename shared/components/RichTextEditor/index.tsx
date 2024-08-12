import { cn } from "@/shared/lib/utils";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import {
  AnyExtension,
  EditorContent,
  EditorContext,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { forwardRef, useEffect, useState } from "react";
import { FieldError, RefCallBack } from "react-hook-form";
import TableMenu from "./components/TableMenu";
import Toolbar from "./components/Toolbar";

type Props = {
  onChange?: (richText: string) => void;
  value?: string;
  className?: string;
  limit?: number;
  hideToolbar?: boolean;
  placeholder?: string;
  error?: FieldError;
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
    }: Props,
    forwardedRef,
  ) => {
    const [focused, setFocused] = useState<boolean>(false);

    const hasLimit = !isNaN(Number(limit));

    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          // Use a placeholder:
          placeholder,
          // Use different placeholders depending on the node type:
          // placeholder: ({ node }) => {
          //   if (node.type.name === 'heading') {
          //     return 'What’s the title?'
          //   }

          //   return 'Can you add some further context?'
          // },
        }),
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
      ].filter((v) => !!v) as AnyExtension[],
      content: value || "",
      editorProps: {
        attributes: {
          class: "min-h-40 p-3 pb-6 outline-none focus:border-gray-9",
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

    const charsLeft = hasLimit
      ? limit! - editor?.storage.characterCount.characters()
      : null;

    return (
      <EditorContext.Provider value={{ editor }}>
        <div
          tabIndex={0}
          ref={(e) => {
            if (typeof forwardedRef === "function") {
              (forwardedRef as RefCallBack)(e);
            }
          }}
          className={cn(
            "border-gray-1 relative h-fit min-h-52 rounded-md border",
            {
              "border-black outline-none ring-2 ring-ring ring-offset-2":
                focused,
              ["border-destructive"]: !!error,
            },
            className,
          )}
        >
          {!hideToolbar && <Toolbar />}
          <EditorContent
            editor={editor}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <TableMenu />
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
