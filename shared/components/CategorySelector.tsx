"use client";

import { ChevronDownIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { FieldError } from "react-hook-form";
import useCategories from "../hooks/useCategories";
import { cn } from "../lib/utils";
import { OrbisDBRow } from "../types";
import { Category } from "../types/category";
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
  selectedCategory?: OrbisDBRow<Category>;
  error?: FieldError;
  onSelect?: (
    category: OrbisDBRow<Category> | (Category & { stream_id: string }),
  ) => void;
  categories?: (Category & { stream_id: string })[];
};
const CategorySelector = forwardRef<HTMLButtonElement, Props>(
  (
    { label = "Category", selectedCategory, error, onSelect, ...props },
    forwardedRef,
  ) => {
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
                {(props.categories?.length ? props.categories : categories).map(
                  (category) => {
                    const { stream_id, name, description } = category;
                    return (
                      <CommandItem
                        key={stream_id}
                        className="teamaspace-y-1 flex cursor-pointer flex-col items-start px-4 py-2"
                        value={name}
                        onSelect={() => {
                          onSelect?.(category);
                          setOpen(false);
                        }}
                      >
                        <p>{name}</p>
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {description}
                        </p>
                      </CommandItem>
                    );
                  },
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

// Set the display name
CategorySelector.displayName = "CategorySelector";

export default CategorySelector;
