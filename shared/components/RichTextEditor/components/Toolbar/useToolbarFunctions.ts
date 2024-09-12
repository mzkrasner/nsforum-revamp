import { Level } from "@tiptap/extension-heading";
import useEditorContext from "../../hooks/useEditorContext";
import useMdEditorFunctions from "../MdEditor/useMdEditorFunctions";

const useToolbarFunctions = () => {
  const { editor, isMdEditorActive } = useEditorContext();

  const md = useMdEditorFunctions();

  const isBoldActive = () => {
    if (isMdEditorActive) return md.isNodeActive("StrongEmphasis");
    return !!editor?.isActive("bold");
  };

  const isItalicActive = () => {
    if (isMdEditorActive) return md.isNodeActive("Emphasis");
    return editor?.isActive("italic");
  };

  const isBulletedListActive = () => {
    if (isMdEditorActive) return md.isNodeActive("BulletList");
    return editor?.isActive("bulletlist");
  };

  const isOrderedListActive = () => {
    if (isMdEditorActive) return md.isNodeActive("OrderedList");
    return editor?.isActive("orderedList");
  };

  const isHeadingActive = (level: Level) => {
    if (isMdEditorActive) return md.isNodeActive(`ATXHeading${level}`);
    return editor?.isActive("heading", { level });
  };

  const toggleBold = () => {
    if (isMdEditorActive) return md.toggleSelectionWrapper("**");
    return editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    if (isMdEditorActive) return md.toggleSelectionWrapper("_");
    return editor?.chain().focus().toggleItalic().run();
  };

  const toggleHeading = (level: Level) => {
    if (isMdEditorActive) return md.toggleHeading(level);
    return editor?.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBulletedList = () => {
    if (isMdEditorActive) return md.toggleBulletList();
    return editor?.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = (num: number = 1) => {
    if (isMdEditorActive) return md.toggleOrderedList(num);
    return editor?.chain().focus().toggleOrderedList().run();
  };

  return {
    isBoldActive,
    isItalicActive,
    isBulletedListActive,
    isOrderedListActive,
    isHeadingActive,
    toggleBold,
    toggleItalic,
    toggleHeading,
    toggleBulletedList,
    toggleOrderedList,
  };
};

export default useToolbarFunctions;
