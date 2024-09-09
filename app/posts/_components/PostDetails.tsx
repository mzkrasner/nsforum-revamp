"use client";

import { cn } from "@/shared/lib/utils";
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
      <div
        className={cn("container relative py-5 md:grid", {
          "md:grid-cols-[280px_1fr]": isTableOfContentOpen,
        })}
      >
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
      </div>
      <div
        className={cn("container relative pb-10 pt-5 md:grid", {
          "md:grid-cols-[280px_1fr]": isTableOfContentOpen,
        })}
      >
        <div></div>
        <div className="mx-auto w-full max-w-[600px]">
          <PostComments />
        </div>
      </div>
    </div>
  );
};
export default PostDetails;
