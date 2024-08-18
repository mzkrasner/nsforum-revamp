import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDownIcon, Table2Icon } from "lucide-react";

const TableCellButtons = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="px-1">
          <Table2Icon size={20} />
          <ChevronDownIcon size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit space-y-1 p-1">
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => editor.chain().focus().mergeCells().run()}
          disabled={!editor.can().mergeCells()}
        >
          Merge cells
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => editor.chain().focus().splitCell().run()}
          disabled={!editor.can().splitCell()}
        >
          Split cell
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default TableCellButtons;
