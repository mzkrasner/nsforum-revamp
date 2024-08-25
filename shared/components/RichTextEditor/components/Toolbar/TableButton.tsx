import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Toggle } from "@/shared/components/ui/toggle";
import { cn } from "@/shared/lib/utils";
import { useCurrentEditor } from "@tiptap/react";
import { TableIcon } from "lucide-react";
import { useEffect, useState } from "react";

const TableButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [tableSelectorGridSize, setTableSelectorGridSize] =
    useState<number>(10);
  const [insertRows, setInsertRows] = useState<number | undefined>();
  const [insertColumns, setInsertColumns] = useState<number | undefined>();

  useEffect(() => {
    if (!open) {
      setInsertRows(0);
      setInsertColumns(0);
    }
  }, [open]);

  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: insertRows,
        cols: insertColumns,
        withHeaderRow: true,
      })
      .run();
  };

  const handleMouseEnter = (index: number) => {
    const column = (index % tableSelectorGridSize) + 1;
    const row = Math.floor(index / tableSelectorGridSize) + 1;
    setInsertColumns(column);
    setInsertRows(row);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Toggle
          size="sm"
          className="h-8 w-8"
          pressed={editor.isActive("table")}
        >
          <TableIcon className="h-4 w-4" />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="mb-2 flex items-center justify-center gap-3 text-sm">
          <span>Rows: {insertRows}</span>
          <span>Columns: {insertColumns}</span>
        </div>
        <div
          className="grid w-fit gap-2"
          style={{
            gridTemplateColumns: `repeat(${tableSelectorGridSize}, minmax(0, 1fr))`,
          }}
        >
          {[...Array(tableSelectorGridSize ** 2)].map((_, i) => {
            let isHighlighted = false;
            if (insertRows && insertColumns) {
              const column = (i % tableSelectorGridSize) + 1;
              const row = Math.floor(i / tableSelectorGridSize) + 1;
              isHighlighted = row <= insertRows && column <= insertColumns;
            }
            return (
              <div
                key={i}
                className={cn(
                  "h-6 w-6 cursor-pointer border border-neutral-300",
                  {
                    "bg-neutral-200": isHighlighted,
                  },
                )}
                onMouseEnter={() => handleMouseEnter(i)}
                onClick={insertTable}
              ></div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default TableButton;
