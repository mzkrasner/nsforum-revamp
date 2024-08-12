import PostInfo from "@/shared/components/PostInfo";
import usePost from "../_hooks/usePost";

const PostHeading = () => {
  const {
    postQuery: { isLoading, data },
  } = usePost();
  if (isLoading) return "Loading...";
  if (!data) return "No data found...";
  const { title } = data;
  return (
    <div className="mb-5">
      <h2 className="font-serif text-3xl font-medium">{title}</h2>
      <PostInfo post={data} />
    </div>
  );
};
export default PostHeading;
