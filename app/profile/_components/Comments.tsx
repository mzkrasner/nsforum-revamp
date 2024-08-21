import CommentList from "@/shared/components/CommentList";
import useProfile from "@/shared/hooks/useProfile";

const Comments = () => {
  const { profile } = useProfile();
  if (!profile) return null;
  const { controller } = profile;
  return <CommentList fetchCommentsOptions={{ controller }} noReplies />;
};
export default Comments;
