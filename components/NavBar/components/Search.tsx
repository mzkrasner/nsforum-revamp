"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheckIcon, SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const Search = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex w-full max-w-[300px] items-center justify-start gap-2 text-sm text-neutral-500"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="w-4" />
        Search...
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
                    <Card onClick={() => console.log("clicked")}>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Dignissimos doloremque commodi, porro officiis
                          voluptatem eius.
                        </CardTitle>
                        <CardDescription className="text-neutral-800">
                          <div className="relative inline-flex h-8 items-center gap-2 rounded-full p-1 hover:bg-transparent">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/avatars/01.png"
                                alt="@shadcn"
                              />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="inline-flex items-center gap-1 text-xs leading-none text-muted-foreground">
                              john_doe
                              <BadgeCheckIcon className="w-5 fill-neutral-700 stroke-white" />
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </CommandDialog>
    </>
  );
  // return (
  // <Button
  //   variant="outline"
  //   size="sm"
  //   className="w-40 items-center justify-start gap-2 text-sm text-neutral-500"
  // >
  //   <SearchIcon className="w-4" />
  //   Search...
  // </Button>
  //   <CommandDialog open={open} onOpenChange={setOpen}>
  //   <CommandInput placeholder="Type a command or search..." />
  //   <CommandList>
  //     <CommandEmpty>No results found.</CommandEmpty>
  //     <CommandGroup heading="Suggestions">
  //       <CommandItem>Calendar</CommandItem>
  //       <CommandItem>Search Emoji</CommandItem>
  //       <CommandItem>Calculator</CommandItem>
  //     </CommandGroup>
  //   </CommandList>
  // </CommandDialog>
  // );
};

export default Search;
