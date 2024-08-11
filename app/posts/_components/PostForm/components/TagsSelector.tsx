import { CheckIcon, PlusCircleIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

type Props = {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

const TagsSelector = ({ options }: Props) => {
  const selectedTags = new Set([] as string[]);

  const isEmpty = !selectedTags.size;

  return (
    <div className="rounded-md border border-neutral-200 p-3">
      {isEmpty ? (
        <span className="text-sm text-neutral-500">No tags selected</span>
      ) : (
        <ul className="min-h-8">
          {options
            .filter((option) => selectedTags.has(option.value))
            .map((option) => (
              <Badge
                variant="secondary"
                key={option.value}
                className="rounded-sm px-1 font-normal"
              >
                {option.label}
              </Badge>
            ))}
        </ul>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="mt-3 flex h-8">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add tags
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Add tags" />
            <CommandList>
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedTags.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) {
                          selectedTags.delete(option.value);
                        } else {
                          selectedTags.add(option.value);
                        }
                        const filterValues = Array.from(selectedTags);
                        // column?.setFilterValue(
                        //   filterValues.length ? filterValues : undefined,
                        // );
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <CheckIcon className={cn("h-4 w-4")} />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                      {/* {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )} */}
                      Facet label
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedTags.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      // onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagsSelector;
