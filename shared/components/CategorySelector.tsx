import { ChevronDownIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { FieldError } from "react-hook-form";
import useCategories from "../hooks/useCategories";
import { cn } from "../lib/utils";
import { Category } from "../schema/category";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  label?: string;
  selectedCategory?: Category;
  error?: FieldError;
  onSelect?: (category: Category) => void;
};
const CategorySelector = forwardRef<HTMLButtonElement, Props>(
  ({ label = "Category", selectedCategory, error, onSelect }, forwardedRef) => {
    const [open, setOpen] = useState(false);

    const { categories } = useCategories();

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={forwardedRef}
            variant="outline"
            size="sm"
            className={cn("ml-auto font-normal", {
              ["border-destructive"]: !!error,
            })}
          >
            {selectedCategory ? selectedCategory.name : label}
            <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup className="p-1.5">
                {categories.map((category) => {
                  const { id, name, description } = category;
                  return (
                    <CommandItem
                      key={id}
                      className="teamaspace-y-1 flex cursor-pointer flex-col items-start px-4 py-2"
                      value={id}
                      onSelect={() => {
                        onSelect?.(category);
                        setOpen(false);
                      }}
                    >
                      <p>{name}</p>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
export default CategorySelector;
