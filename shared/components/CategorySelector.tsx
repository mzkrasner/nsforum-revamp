import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

type Props = { label?: string };
const CategorySelector = ({ label = "Category" }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto font-normal">
          {label}
          <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup className="p-1.5">
              <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                <p>General</p>
                <p className="text-sm text-muted-foreground">
                  Can view and comment.
                </p>
              </CommandItem>
              <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                <p>Meta</p>
                <p className="text-sm text-muted-foreground">
                  Can view, comment and edit.
                </p>
              </CommandItem>
              <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                <p>Network Societies</p>
                <p className="text-sm text-muted-foreground">
                  Admin-level access to all resources.
                </p>
              </CommandItem>
              <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                <p>Charter Cities</p>
                <p className="text-sm text-muted-foreground">
                  Admin-level access to all resources.
                </p>
              </CommandItem>
              <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                <p>Startup Cities</p>
                <p className="text-sm text-muted-foreground">
                  Can view, comment and manage billing.
                </p>
              </CommandItem>
              <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                <p>Shilling</p>
                <p className="text-sm text-muted-foreground">
                  Admin-level access to all resources.
                </p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default CategorySelector;
