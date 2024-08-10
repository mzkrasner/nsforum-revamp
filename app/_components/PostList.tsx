import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import PostFilters from "./PostFilters";

const PostList = () => {
  return (
    <section className="container">
      <div className="mb-5 flex items-center justify-between">
        <PostFilters />
        <Button size="sm" asChild>
          <Link href="/posts/new">Create Post</Link>
        </Button>
      </div>
      <ul>
        {[...Array(5)].map((_, i) => {
          return (
            <li key={i} className="mb-5">
              <PostCard />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
export default PostList;
