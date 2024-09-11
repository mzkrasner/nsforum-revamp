"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import Link from "next/link";
import useTags from "../hooks/useTags";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";
import PostInfo from "./PostInfo";
import PostTags from "./PostTags";

type Props = { post: OrbisDBRow<Post> };
const PostCard = ({ post }: Props) => {
  const { title, slug, tag_ids } = post || {};
  const { tags } = useTags({
    fetchTagsOptions: {
      filter: {
        stream_id: tag_ids || [],
      },
    },
  });
  return (
    <Card>
      <CardHeader className="space-y-0 p-3">
        <CardTitle className="text-base font-medium">
          <Link href={`/posts/${slug}`} className="link inline-block">
            {title}
          </Link>
        </CardTitle>
        <CardContent className="m-0 p-0">
          <PostInfo post={post} />
          <PostTags tags={tags} />
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default PostCard;
