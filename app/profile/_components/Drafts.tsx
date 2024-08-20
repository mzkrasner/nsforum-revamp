import PostList from "@/shared/components/PostList";
import useProfile from "@/shared/hooks/useProfile";

const Drafts = () => {
  const { profile } = useProfile();
  if (!profile) return null;
  const { controller } = profile;
  return (
    <PostList fetchPostOptions={{ filter: { controller, status: 'draft' } }} />
  );
};
export default Drafts;
