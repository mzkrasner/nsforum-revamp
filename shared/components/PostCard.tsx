"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import PostInfo from "./PostInfo";
import { Button } from "./ui/button";

type Props = {};
const PostCard = (props: Props) => {
  return (
    <Card onClick={() => console.log("clicked")}>
      <CardHeader className="space-y-0 p-3">
        <CardTitle className="text-base font-medium">
          <Link href="/posts/1" className="link inline-block">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
            doloremque commodi, porro officiis voluptatem eius.
          </Link>
        </CardTitle>
        <CardContent className="m-0 p-0">
          <PostInfo />
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
