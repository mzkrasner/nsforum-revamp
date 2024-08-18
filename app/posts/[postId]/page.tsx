import { fetchPost } from "@/shared/orbis/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostActions from "../_components/PostActions";
import PostBody from "../_components/PostBody";
import PostHeading from "../_components/PostHeading";

const PostPage = async ({
  params: { postId },
}: {
  params: { postId: string };
}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", { postId }],
    queryFn: async () => fetchPost(postId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container pb-10 pt-5 md:grid md:grid-cols-[280px_1fr]">
        <div></div>
        <div>
          <PostActions />
          <PostHeading />
          <PostBody />
        </div>
      </div>
    </HydrationBoundary>
  );
};
export default PostPage;