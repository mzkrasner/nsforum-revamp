"use client";

import PostInfo from "@/shared/components/PostInfo";
import PostTags from "@/shared/components/PostTags";
import useTags from "@/shared/hooks/useTags";
import usePost from "../_hooks/usePost";

const PostTop = () => {
  const {
    post,
    postQuery: { isLoading },
  } = usePost();
  if (isLoading) return "Loading...";
  if (!post) return "No post found...";
  const { title, tag_ids } = post;
  const { tags } = useTags({
    fetchTagsOptions: {
      filter: {
        stream_id: tag_ids || [],
      },
    },
  });
  return (
    <div className="mb-5">
      <h2 className="font-serif text-3xl font-medium">{title}</h2>
      <PostInfo post={post} />
      <PostTags tags={tags} />
    </div>
  );
};
export default PostTop;
