"use client";

import { useState } from "react";
import PostActions from "./PostActions";
import PostBody from "./PostBody";
import PostComments from "./PostComments";
import PostReaction from "./PostReaction";
import PostTableOfContents from "./PostTableOfContents";
import PostTop from "./PostTop";

const PostDetails = () => {
  const [isTableOfContentOpen, setIsTableOfContentOpen] = useState(false);

  return (
    <div>
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
    </div>
  );
};
export default PostDetails;
