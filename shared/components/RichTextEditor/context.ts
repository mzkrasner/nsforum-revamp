import { createContext } from "react";
import { EditorContextType } from "./types";

export const EditorContext = createContext<EditorContextType>({
  editor: null,
  isMdEditorActive: false,
  toggleMarkdown: () => null,
  mdEditor: null,
  setMdEditor: () => null,
  mdActiveNodeTypes: [],
  setMdActiveNodeTypes: () => null,
});
