import { config } from "@/app/_providers/react-query/config";
import { fetchPost, FetchPostArg } from "@/shared/orbis/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostDetails from "../_components/PostDetails";

const PostPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const queryClient = new QueryClient(config);

  const options: FetchPostArg = { filter: { slug } };
  await queryClient.prefetchQuery({
    queryKey: ["post", options],
    queryFn: async () => fetchPost(options),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetails />
    </HydrationBoundary>
  );
};
export default PostPage;
