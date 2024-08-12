"use client";

import PostActions from "../_components/PostActions";
import PostBody from "../_components/PostBody";
import PostHeading from "../_components/PostHeading";
import usePost from "../_hooks/usePost";

const PostPage = () => {
  usePost();
  return (
    <div className="container pb-10 pt-5 md:grid md:grid-cols-[280px_1fr]">
      <div></div>
      <div>
        <PostActions />
        <PostHeading />
        <PostBody />
      </div>
    </div>
  );
};
export default PostPage;
