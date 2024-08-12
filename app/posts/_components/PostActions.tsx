"use client";

import { Button } from "@/shared/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PostActions = () => {
  const params = useParams();
  const { postId } = params;
  return (
    <div className="mb-2 flex justify-end gap-2 border-b pb-2">
      <Button size="sm" variant="ghost" className="h-8 text-sm">
        <TrashIcon className="mr-2 w-3" /> Delete
      </Button>
      <Button size="sm" variant="ghost" className="h-8 text-sm" asChild>
        <Link href={`/posts/${postId}/edit`}>
          <EditIcon className="mr-2 w-3" /> Edit
        </Link>
      </Button>
    </div>
  );
};
export default PostActions;
