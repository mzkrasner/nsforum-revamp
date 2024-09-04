import { Editor } from "@tiptap/react";
import { useCodeMirror } from "@uiw/react-codemirror";

export type MdEditorType = ReturnType<typeof useCodeMirror>;

export interface EditorContextType {
  editor: Editor | null;
  uploadImage?: (file: File) => Promise<string>;
  isMdEditorActive: boolean;
  toggleMarkdown: () => void;
  mdEditor: MdEditorType | null;
  setMdEditor: (value: MdEditorType | null) => void;
}
