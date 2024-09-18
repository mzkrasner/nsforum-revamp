"use client";

import { OrbisDBRow } from "@/shared/types";
import { Post } from "@/shared/types/post";
import { useState } from "react";
import { PostContext } from "../context";
import PostActions from "./PostActions";
import PostBody from "./PostBody";
import PostComments from "./PostComments";
import PostReaction from "./PostReaction";
import PostTableOfContents from "./PostTableOfContents";
import PostTop from "./PostTop";

type Props = {
  initialData?: OrbisDBRow<Post> | null;
};
const PostDetails = ({ initialData }: Props) => {
  const [isTableOfContentOpen, setIsTableOfContentOpen] = useState(false);

  return (
    <PostContext.Provider value={{ initialData }}>
      <div className="container relative py-5 md:grid md:grid-cols-[auto_1fr] md:grid-rows-[auto_auto]">
        <PostTableOfContents
          open={isTableOfContentOpen}
          setOpen={setIsTableOfContentOpen}
        />
        <div className="mx-auto w-full max-w-[600px]">
          <PostActions />
          <PostTop />
          <PostBody />
          <PostReaction />
        </div>
        <div>{/* Comment table of content */}</div>
        <div className="mx-auto w-full max-w-[600px]">
          <PostComments />
        </div>
      </div>
    </PostContext.Provider>
  );
};
export default PostDetails;
