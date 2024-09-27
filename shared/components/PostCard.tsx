"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { HTMLAttributes } from "react";
import useProfile from "../hooks/useProfile";
import useTags from "../hooks/useTags";
import { cn } from "../lib/utils";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";
import PostInfo from "./PostInfo";
import PostTags from "./PostTags";
import { Button } from "./ui/button";

type Props = { post: OrbisDBRow<Post> } & HTMLAttributes<HTMLDivElement>;
const PostCard = ({ post, className = "", ...props }: Props) => {
  const { profile } = useProfile();
  const { title, slug, tag_ids, controller, stream_id } = post || {};
  const { tags } = useTags({
    fetchTagsOptions: {
      filter: {
        stream_id: tag_ids || [],
      },
    },
  });
  const isAuthor = profile?.controller === controller;
  return (
    <Card className={cn("p-3", className)} {...props}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0">
        <CardTitle className="text-base font-medium">
          <Link href={`/posts/${slug}`} className="link inline-block">
            {title}
          </Link>
        </CardTitle>
        {isAuthor && (
          <Button
            variant="ghost"
            size="icon"
            className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
            asChild
          >
            <Link href={`/posts/${stream_id}/edit`}>
              <EditIcon size={16} className="text-neutral-500" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="m-0 p-0">
        <PostInfo post={post} />
        <PostTags tags={tags} />
      </CardContent>
    </Card>
  );
};
export default PostCard;
