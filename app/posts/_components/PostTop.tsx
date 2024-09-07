"use client";

import PostInfo from "@/shared/components/PostInfo";
import PostTags from "@/shared/components/PostTags";
import usePost from "../_hooks/usePost";

const PostTop = () => {
  const {
    post,
    postQuery: { isLoading },
  } = usePost();
  if (isLoading) return "Loading...";
  if (!post) return "No post found...";
  const { title } = post;
  return (
    <div className="mb-5">
      <h2 className="font-serif text-3xl font-medium">{title}</h2>
      <PostInfo post={post} />
      <PostTags tags={[{ name: "Example Tag", description: "", id: "0" }]} />
    </div>
  );
};
export default PostTop;
