import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDownIcon, Rows3Icon } from "lucide-react";

const TableRowButtons = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="px-1">
          <Rows3Icon size={20} />
          <ChevronDownIcon size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit space-y-1 p-1">
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => {
            editor.chain().focus().addRowBefore().run();
          }}
          disabled={!editor.can().addRowBefore()}
        >
          Add row before
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => {
            editor.chain().focus().addRowAfter().run();
          }}
          disabled={!editor.can().addRowAfter()}
        >
          Add row after
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => {
            editor.chain().focus().deleteRow().run();
          }}
          disabled={!editor.can().deleteRow()}
        >
          Delete row
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default TableRowButtons;
