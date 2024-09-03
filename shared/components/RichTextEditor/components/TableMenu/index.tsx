import { BubbleMenu } from "@tiptap/react";
import useEditorContext from "../../hooks/useEditorContext";
import TableButtons from "./TableButtons";
import TableCellButtons from "./TableCellButtons";
import TableColumnButtons from "./TableColumnButtons";
import TableRowButtons from "./TableRowButtons";

const TableMenu = () => {
  const { editor } = useEditorContext();

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        // onCreate: (instance) => {
        //   tippyInstanceRef.current = instance;
        // },
      }}
      shouldShow={({ editor, state }) => {
        // const { $anchor } = state.selection;
        return editor.isActive("table");
      }}
    >
      <div className="border-gray-1 flex gap-1 rounded-md border bg-white p-1">
        <TableCellButtons />
        <TableRowButtons />
        <TableColumnButtons />
        <TableButtons />
      </div>
    </BubbleMenu>
  );
};
export default TableMenu;
