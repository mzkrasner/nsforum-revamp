import { Editor } from "@tiptap/react";

export interface EditorContextType {
  editor: Editor | null;
  uploadImage?: (file: File) => Promise<string>;
}
