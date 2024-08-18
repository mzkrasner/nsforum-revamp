"use client";

import { posts } from "@/data/posts";
import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";

const Posts = () => {
  return (
    <div>
      <ul className="space-y-5">
        {posts.map((post, i) => {
          return (
            <li key={i}>
              <PostCard post={post} />
            </li>
          );
        })}
      </ul>
      <Button variant="secondary" className="mx-auto mt-5 block w-fit">
        Load more
      </Button>
    </div>
  );
};
export default Posts;
