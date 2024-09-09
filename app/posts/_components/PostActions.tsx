"use client";

import { Button } from "@/shared/components/ui/button";
import useProfile from "@/shared/hooks/useProfile";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import usePost from "../_hooks/usePost";
import DeletePostButton from "./DeletePostButton";

const PostActions = () => {
  const params = useParams();
  const { slug } = params;

  const { profile } = useProfile();

  const { post } = usePost();
  const postId = post?.stream_id;

  if (!slug || profile?.controller !== post?.controller) return null;

  return (
    <div className="mb-2 flex justify-end gap-2 pb-2">
      {postId && <DeletePostButton postId={postId} />}
      <Button
        variant="ghost"
        size="icon"
        className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
        asChild
      >
        <Link href={`/posts/${slug}/edit`}>
          <EditIcon size={14} />
        </Link>
      </Button>
    </div>
  );
};
export default PostActions;
