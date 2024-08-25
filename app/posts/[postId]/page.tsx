import { config } from "@/app/_providers/react-query/config";
import { fetchPost } from "@/shared/orbis/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostDetails from "../_components/PostDetails";

const PostPage = async ({
  params: { postId },
}: {
  params: { postId: string };
}) => {
  const queryClient = new QueryClient(config);

  await queryClient.prefetchQuery({
    queryKey: ["post", { postId }],
    queryFn: async () => fetchPost(postId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetails />
    </HydrationBoundary>
  );
};
export default PostPage;
