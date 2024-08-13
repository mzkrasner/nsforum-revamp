import PostCard from "@/shared/components/PostCard";
import { Button } from "@/shared/components/ui/button";
import { Post } from "@/shared/schema/post";
import Link from "next/link";
import PostFilters from "./PostFilters";

type Props = { posts: Post[] };
const PostList = ({ posts }: Props) => {
  return (
    <section className="container">
      <div className="mb-5 flex items-center justify-between">
        <PostFilters />
        <Button size="sm" asChild>
          <Link href="/posts/new">Create Post</Link>
        </Button>
      </div>
      <ul>
        {posts.map((post, i) => {
          return (
            <li key={i} className="mb-5">
              <PostCard post={post} />
            </li>
          );
        })}
      </ul>
      {!posts.length && (
        <div className="py-10 text-center text-neutral-500">No post found</div>
      )}
    </section>
  );
};
export default PostList;
