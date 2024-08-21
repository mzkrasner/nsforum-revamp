import PostList from "@/shared/components/PostList";
import useProfile from "@/shared/hooks/useProfile";

const Posts = () => {
  const { profile } = useProfile();
  if (!profile) return null;
  const { controller } = profile;
  return (
    <PostList
      fetchPostsOptions={{ filter: { controller, status: "published" } }}
    />
  );
};
export default Posts;
