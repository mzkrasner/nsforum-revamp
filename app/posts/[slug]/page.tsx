import { config } from "@/app/_providers/react-query/config";
import { fetchPost, FetchPostArg } from "@/shared/orbis/queries";
import { QueryClient } from "@tanstack/react-query";
import { unstable_cache } from "next/cache";
import PostDetails from "../_components/PostDetails";

const PostPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const queryClient = new QueryClient(config);

  const options: FetchPostArg = { filter: { slug } };
  const getInitialData = unstable_cache(
    async () => {
      return await queryClient.fetchQuery({
        queryKey: ["post", options],
        queryFn: async () => fetchPost(options),
      });
    },
    [slug],
    { tags: ["post", slug] },
  );
  const initialData = await getInitialData();

  return <PostDetails initialData={initialData} />;
};
export default PostPage;
