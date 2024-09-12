import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxTree } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";
import useEditorContext from "../../hooks/useEditorContext";
import { MdNodeType } from "../../types";

const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
];

const MdEditor = () => {
  const {
    editor,
    mdEditor: contextMdEditor,
    setMdEditor,
    setMdActiveNodeTypes,
  } = useEditorContext();
  const setContextMdEditor = useRef(setMdEditor).current;

  if (!editor) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mdEditor = useCodeMirror({
    container: containerRef.current,
    extensions,
    value: editor.storage.markdown.getMarkdown(),
    onChange: (_, { state }) => {
      const selection = state.selection.main;
      const from = selection.from;
      const to = selection.to;

      const activeNodeTypes: MdNodeType[] = [];

      syntaxTree(state).iterate({
        from,
        to,
        enter: (node) => {
          const type = node.type.name;
          activeNodeTypes.push(type as MdNodeType);
        },
      });

      setMdActiveNodeTypes(activeNodeTypes);
    },
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
