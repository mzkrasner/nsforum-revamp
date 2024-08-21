"use client";

import CommentForm from "@/shared/components/CommentForm";
import CommentList from "@/shared/components/CommentList";
import useProfile from "@/shared/hooks/useProfile";
import { useParams } from "next/navigation";

type Props = {};
const PostComments = (props: Props) => {
  const params = useParams();
  const postId = params.postId as string;

  const { profile } = useProfile();

  return (
    <div>
      <div className="mb-8 mt-10">
        <CommentForm />
      </div>
      <CommentList fetchCommentsOptions={{ postId, parentId: postId }} />
    </div>
  );
};
export default PostComments;
