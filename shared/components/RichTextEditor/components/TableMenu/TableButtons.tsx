import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useCurrentEditor } from "@tiptap/react";
import { ChevronDownIcon, TableIcon } from "lucide-react";

const TableButtons = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="px-1">
          <TableIcon size={20} />
          <ChevronDownIcon size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit space-y-1 p-1">
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
        >
          Delete table
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default TableButtons;
