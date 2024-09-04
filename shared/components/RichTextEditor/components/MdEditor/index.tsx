import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";
import useEditorContext from "../../hooks/useEditorContext";
const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
];

const MdEditor = () => {
  const { editor, mdEditor: contextMdEditor, setMdEditor } = useEditorContext();
  const setContextMdEditor = useRef(setMdEditor).current;

  if (!editor) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mdEditor = useCodeMirror({
    container: containerRef.current,
    extensions,
    value: editor.storage.markdown.getMarkdown(),
    // onChange: (value) => editor.commands.setContent(value),
  });
  const { setContainer } = mdEditor;

  useEffect(() => {
    if (containerRef.current) {
      setContainer(containerRef.current);
    }
  }, [containerRef.current]);

  useEffect(() => {
    if (mdEditor?.state && !contextMdEditor) {
      setContextMdEditor(mdEditor);
    }
  }, [mdEditor, contextMdEditor, setContextMdEditor]);

  return <div ref={containerRef} />;
};
export default MdEditor;
