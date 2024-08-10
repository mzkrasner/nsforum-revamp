import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import PostFilters from "./PostFilters";

const PostList = () => {
  return (
    <section className="container">
      <div className="mb-5 flex items-center justify-between">
        <PostFilters />
        <Button size="sm">Create Post</Button>
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
