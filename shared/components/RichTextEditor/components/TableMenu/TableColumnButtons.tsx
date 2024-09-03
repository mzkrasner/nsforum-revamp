import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ChevronDownIcon, Columns3Icon } from "lucide-react";
import useEditorContext from "../../hooks/useEditorContext";

const TableColumnButtons = () => {
  const { editor } = useEditorContext();

  if (!editor) {
    return null;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="px-1">
          <Columns3Icon size={20} />
          <ChevronDownIcon size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit space-y-1 p-1">
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
        >
          Add column before
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
        >
          Add column after
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="block w-full text-left"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
        >
          Delete column
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default TableColumnButtons;
