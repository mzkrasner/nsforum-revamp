import { BoldIcon, Code2Icon, ItalicIcon, StrikethroughIcon } from "lucide-react";
import ToolbarButton from "./ToolbarButton";
import { useCurrentEditor } from "@tiptap/react";
import HeadingButtons from "./HeadingButtons";
import InsertButtons from "./InsertButtons";

const Toolbar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

	return (
		<div className="sticky top-0 left-0 z-10 min-w-fit flex items-center gap-1 border-b border-gray-500/50 p-1">
      <ToolbarButton 
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        <BoldIcon className="w-3.5" />
      </ToolbarButton>
			<ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        <ItalicIcon className="w-3.5" />
      </ToolbarButton>
			<ToolbarButton
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
      >
        <StrikethroughIcon className="w-3.5" />
      </ToolbarButton>
			<ToolbarButton
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
      >
        <Code2Icon className="w-3.5" />
      </ToolbarButton>
      <span className="mx-1 inline-block w-[1px] h-4 bg-gray-500/50"></span>
			<HeadingButtons />
      <span className="ml-auto inline-block w-[1px] h-4"></span>
			<InsertButtons />
		</div>
	);
};
export default Toolbar;
