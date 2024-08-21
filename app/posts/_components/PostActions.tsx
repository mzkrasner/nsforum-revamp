"use client";

import { Button } from "@/shared/components/ui/button";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DeletePostButton from "./DeletePostButton";

const PostActions = () => {
  const params = useParams();
  const { postId } = params;
  if (!postId) return null;
  return (
    <div className="mb-2 flex justify-end gap-2 pb-2">
      <DeletePostButton postId={postId as string} />
      <Button
        variant="ghost"
        size="icon"
        className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
        asChild
      >
        <Link href={`/posts/${postId}/edit`}>
          <EditIcon size={14} />
        </Link>
      </Button>
    </div>
  );
};
export default PostActions;
