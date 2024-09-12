import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxTree } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorView, keymap, Prec, useCodeMirror } from "@uiw/react-codemirror";
import { useEffect, useMemo, useRef } from "react";
import useEditorContext from "../../hooks/useEditorContext";
import { MdNodeType } from "../../types";
import useToolbarFunctions from "../Toolbar/useToolbarFunctions";

const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
];

const MdEditor = () => {
  const {
    editor: tiptapEditor,
    mdEditor: contextMdEditor,
    setMdEditor,
    setMdActiveNodeTypes,
  } = useEditorContext();
  const toolbarFns = useToolbarFunctions();
  const setContextMdEditor = useRef(setMdEditor).current;

  const keyBindings = useMemo(() => {
    const { toggleBold, toggleItalic } = toolbarFns;
    return [
      {
        key: "Mod-b",
        run: () => {
          toggleBold();
          return true;
        },
      },
      {
        key: "Mod-i",
        run: () => {
          toggleItalic();
          return true;
        },
      },
    ];
  }, [toolbarFns]);

  if (!tiptapEditor) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mdEditor = useCodeMirror({
    container: containerRef.current,
    extensions: [
      ...extensions,
      EditorView.lineWrapping,
      Prec.highest(keymap.of(keyBindings)),
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
    value: tiptapEditor.storage.markdown.getMarkdown(),
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
