"use client";

import CommentForm from "@/shared/components/CommentForm";
import CommentList from "@/shared/components/CommentList";
import usePost from "../_hooks/usePost";

const PostComments = () => {
  const { post } = usePost();
  if (!post) return null;
  const postId = post.stream_id;

  const fetchCommentsArg = {
    filter: { post_id: postId, parent_ids: "" },
  };

  return (
    <div>
      <div className="mb-8">
        <CommentForm fetchCommentsArg={fetchCommentsArg} />
      </div>
      <CommentList fetchCommentsArg={fetchCommentsArg} />
    </div>
  );
};
export default PostComments;
