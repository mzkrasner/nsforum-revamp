import { fetchPost } from "@/shared/orbis/queries";
import { cache, PropsWithChildren } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const slug = params?.slug;
  const defaultMetaData = {
    title: "Post",
  };
  if (!slug) return defaultMetaData;

  const cachedFetchPost = cache(
    async () =>
      await fetchPost({
        filter: { slug },
        columns: ["title", "preview"],
      }),
  );

  const post = await cachedFetchPost();
  if (!post) return defaultMetaData;

  return {
    title: post.title || defaultMetaData.title,
    description: post.preview || undefined,
  };
};

const PostLayout = ({ children }: PropsWithChildren) => {
  return children;
};
export default PostLayout;
