import { CheckIcon, PlusCircleIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

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
import useTags from "@/shared/hooks/useTags";
import { cn } from "@/shared/lib/utils";
import { FieldError } from "react-hook-form";

type Props = {
  selectedTags?: string[];
  error?: FieldError;
  onChange?: (tagIds: string[]) => void;
};

const TagsSelector = ({
  selectedTags: _selectedTags = [],
  onChange,
  error,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { tags } = useTags();

  const selectTag = (id: string) => onChange?.([..._selectedTags, id]);

  const deselectTag = (id: string) =>
    onChange?.(_selectedTags.filter((tagId) => tagId !== id));

  const selectedTags = new Set(_selectedTags);
  const isEmpty = !selectedTags.size;

  return (
    <div
      className={cn("rounded-md border border-neutral-200 p-3", {
        ["border-destructive"]: !!error,
      })}
    >
      {isEmpty ? (
        <span className="text-sm text-neutral-500">No tags selected</span>
      ) : (
        <div className="flex min-h-8 flex-wrap gap-3">
          {tags
            .filter((tag) => selectedTags.has(tag.id))
            .map((tag) => (
              <Badge
                variant="secondary"
                key={tag.id}
                className="flex h-6 items-center gap-2 rounded-sm px-1 font-normal"
              >
                {tag.name}
                <Button size="sm" variant="secondary" className="h-4 w-4 p-0">
                  <XCircleIcon
                    className="h-3.5 w-3.5 text-neutral-500"
                    onClick={() => deselectTag(tag.id)}
                  />
                </Button>
              </Badge>
            ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
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
                {tags.map((tag) => {
                  const { id, name } = tag;
                  const isSelected = selectedTags.has(id);
                  return (
                    <CommandItem
                      key={id}
                      value={id}
                      onSelect={() => {
                        if (isSelected) {
                          deselectTag(id);
                        } else {
                          selectTag(id);
                        }
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
                      {name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => onChange?.([])}
                  className="justify-center text-center"
                  disabled={!selectedTags.size}
                >
                  Clear tags
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagsSelector;
