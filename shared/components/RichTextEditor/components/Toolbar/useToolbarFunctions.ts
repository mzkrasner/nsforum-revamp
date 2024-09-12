import { Level } from "@tiptap/extension-heading";
import useEditorContext from "../../hooks/useEditorContext";
import useMdEditorFunctions from "../MdEditor/useMdEditorFunctions";

const useToolbarFunctions = () => {
  const { editor, isMdEditorActive } = useEditorContext();

  const mdEditorFns = useMdEditorFunctions();

  const isBoldActive = () => {
    if (isMdEditorActive) return mdEditorFns.isNodeActive("StrongEmphasis");
    return !!editor?.isActive("bold");
  };

  const isItalicActive = () => {
    if (isMdEditorActive) return mdEditorFns.isNodeActive("Emphasis");
    return editor?.isActive("italic");
  };

  const isBulletedListActive = () => {
    if (isMdEditorActive) return mdEditorFns.isNodeActive("BulletList");
    return editor?.isActive("bulletlist");
  };

  const isOrderedListActive = () => {
    if (isMdEditorActive) return mdEditorFns.isNodeActive("OrderedList");
    return editor?.isActive("orderedList");
  };

  const isHeadingActive = (level: Level) => {
    if (isMdEditorActive) return mdEditorFns.isNodeActive(`ATXHeading${level}`);
    return editor?.isActive("heading", { level });
  };

  const isAnyHeadingActive = () => {
    if (isMdEditorActive)
      return mdEditorFns.isNodeActive([
        "ATXHeading1",
        "ATXHeading2",
        "ATXHeading3",
        "ATXHeading4",
        "ATXHeading5",
        "ATXHeading6",
      ]);
    return editor?.isActive("heading");
  };

  const toggleBold = () => {
    if (isMdEditorActive)
      return mdEditorFns.toggleMark({
        wrapper: "**",
        nodeType: "StrongEmphasis",
      });
    return editor?.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    if (isMdEditorActive)
      return mdEditorFns.toggleMark({ wrapper: "_", nodeType: "Emphasis" });
    return editor?.chain().focus().toggleItalic().run();
  };

  const toggleHeading = (level: Level) => {
    if (isMdEditorActive) return mdEditorFns.toggleHeading(level);
    return editor?.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBulletedList = () => {
    if (isMdEditorActive) return mdEditorFns.toggleBulletList();
    return editor?.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = (num: number = 1) => {
    if (isMdEditorActive) return mdEditorFns.toggleOrderedList(num);
    return editor?.chain().focus().toggleOrderedList().run();
  };

  return {
    isBoldActive,
    isItalicActive,
    isBulletedListActive,
    isOrderedListActive,
    isHeadingActive,
    isAnyHeadingActive,
    toggleBold,
    toggleItalic,
    toggleHeading,
    toggleBulletedList,
    toggleOrderedList,
  };
};

export default useToolbarFunctions;
