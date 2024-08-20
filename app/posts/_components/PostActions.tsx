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
      <Button size="sm" variant="ghost" className="h-8 text-sm" asChild>
        <Link href={`/posts/${postId}/edit`}>
          <EditIcon className="mr-2 w-3" /> Edit
        </Link>
      </Button>
    </div>
  );
};
export default PostActions;
