"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheckIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "./ui/button";

type Props = {};
const PostCard = (props: Props) => {
  return (
    <Card onClick={() => console.log("clicked")}>
      <CardHeader className="space-y-0 p-3">
        <CardTitle className="text-base font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
          doloremque commodi, porro officiis voluptatem eius.
        </CardTitle>
        <CardContent className="m-0 p-0">
          <div className="relative flex h-8 flex-row items-center gap-2 rounded-full p-1 text-xs text-gray-800 hover:bg-transparent">
            By
            <span className="inline-flex items-center gap-1 leading-none text-muted-foreground">
              john_doe
              <BadgeCheckIcon className="w-5 fill-gray-700 stroke-white" />
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto inline-flex h-8 items-center gap-1.5 text-xs"
            >
              Proof <ExternalLinkIcon className="w-4" />
            </Button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <li key={i}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-5 h-7 px-2 text-xs"
                >
                  Tag {i + 1}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default PostCard;
