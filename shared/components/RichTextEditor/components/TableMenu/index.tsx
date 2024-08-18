import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import TableButtons from "./TableButtons";
import TableCellButtons from "./TableCellButtons";
import TableColumnButtons from "./TableColumnButtons";
import TableRowButtons from "./TableRowButtons";

const TableMenu = () => {
  const { editor } = useCurrentEditor();

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
      <div className="flex gap-1 rounded-md border border-gray-1 bg-white p-1">
        <TableCellButtons />
        <TableRowButtons />
        <TableColumnButtons />
        <TableButtons />
      </div>
    </BubbleMenu>
  );
};
export default TableMenu;
