import { useContext } from "react";
import { EditorContext } from "../context";

const useEditorContext = () => {
  const context = useContext(EditorContext);
  return context;
};

export default useEditorContext;
