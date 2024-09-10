import { CheckIcon, PlusIcon, XCircleIcon } from "lucide-react";
import { useRef, useState } from "react";

import TagForm from "@/shared/components/TagForm";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import useInfiniteScroll from "@/shared/hooks/useInfiniteScroll";
import useTags from "@/shared/hooks/useTags";
import { cn } from "@/shared/lib/utils";
import { OrbisDBRow } from "@/shared/types";
import { Tag } from "@/shared/types/tag";
import { produce } from "immer";
import { FieldError } from "react-hook-form";

type Props = {
  selectedTagIds?: string[];
  error?: FieldError;
  onChange?: (tagIds: string[]) => void;
};

const TagsSelector = ({
  selectedTagIds: _selectedTagIds = [],
  onChange,
  error,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<OrbisDBRow<Tag>[]>([]);

  const commandRef = useRef<HTMLDivElement>(null);

  const { tags, searchTerm, setSearchTerm, tagsQuery } = useTags();
  const { hasNextPage, fetchNextPage } = tagsQuery;

  const { ref: infiniteScrollRef } = useInfiniteScroll({
    observerOptions: {
      threshold: 0,
      root: commandRef.current,
    },
    hasNextPage,
    fetchNextPage,
  });

  const selectTag = (id: string) => onChange?.([..._selectedTagIds, id]);

  const deselectTag = (id: string) =>
    onChange?.(_selectedTagIds.filter((tagId) => tagId !== id));

  const selectedTagIds = new Set(_selectedTagIds);
  const isEmpty = !selectedTagIds.size;

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
          {Array.from(selectedTagIds).map((tagId) => {
            const tag =
              selectedTags.find((t) => t.stream_id === tagId) ||
              tags.find((t) => t.stream_id === tagId);
            if (!tag) return null;
            return (
              <Badge
                variant="secondary"
                key={tagId}
                className="flex h-6 items-center gap-2 rounded-sm px-1 font-normal"
              >
                {tag.name}
                <Button size="sm" variant="secondary" className="h-4 w-4 p-0">
                  <XCircleIcon
                    className="h-3.5 w-3.5 text-neutral-500"
                    onClick={() => deselectTag(tag.stream_id)}
                  />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-3 flex h-8 px-2.5">
              <PlusIcon className="h-4 w-4" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new tag</DialogTitle>
              <DialogDescription hidden>Create a new tag</DialogDescription>
            </DialogHeader>
            <TagForm
              onSave={(tag) => {
                selectTag(tag.stream_id);
                setSelectedTags(
                  produce((draft: OrbisDBRow<Tag>[]) => {
                    draft.push(tag);
                  }),
                );
                setIsModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 flex h-8 px-2.5"
            >
              Select tags
            </Button>
          </PopoverTrigger>
          <PopoverContent
            ref={commandRef}
            className="w-[200px] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Add tags"
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => {
                    const { stream_id, name } = tag;
                    const isSelected = selectedTagIds.has(stream_id);
                    return (
                      <CommandItem
                        key={stream_id}
                        value={stream_id}
                        onSelect={() => {
                          if (isSelected) {
                            deselectTag(stream_id);
                          } else {
                            selectTag(stream_id);
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
                <CommandGroup className="flex items-center justify-center">
                  <div ref={infiniteScrollRef}></div>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange?.([])}
                    className="justify-center text-center"
                    disabled={!selectedTagIds.size}
                  >
                    Clear tags
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagsSelector;
