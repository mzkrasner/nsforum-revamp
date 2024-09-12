import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxTree } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorView, useCodeMirror } from "@uiw/react-codemirror";
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
    extensions: [
      ...extensions,
      EditorView.updateListener.of((update) => {
        if (update.selectionSet) {
          const { from, to } = update.state.selection.main;
          const activeNodeTypes: MdNodeType[] = [];

          syntaxTree(update.state).iterate({
            from,
            to,
            enter: (node) => {
              const type = node.type.name;
              activeNodeTypes.push(type as MdNodeType);
            },
          });

          setMdActiveNodeTypes(activeNodeTypes);
        }
      }),
    ],
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
