"use client";

import { Button } from "@/shared/components/ui/button";
import { SearchIcon } from "lucide-react";

import PostCard from "@/shared/components/PostCard";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useState } from "react";

const Search = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto flex items-center justify-between gap-2 text-sm text-gray-500 md:w-full md:max-w-[200px] md:bg-gray-100 lg:max-w-[300px]"
        onClick={() => setOpen(true)}
      >
        <span className="hidden md:inline">Search...</span>
        <SearchIcon className="w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList className="h-fit">
          <ScrollArea>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="3 posts found">
              {[...Array(3)].map((_, i) => {
                return (
                  <CommandItem key={i}>
                    <PostCard />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Search;
