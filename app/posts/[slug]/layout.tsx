import { fetchPost } from "@/shared/orbis/queries";
import { PropsWithChildren } from "react";

const PostLayout = ({ children }: PropsWithChildren) => {
  return children;
};
export default PostLayout;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params?.slug;
  const defaultMetaData = {
    title: "Post page",
  };
  if (!slug) return defaultMetaData;

  const post = await fetchPost({
    filter: { slug },
    columns: ["title", "preview"],
  });
  if (!post) return defaultMetaData;

  return {
    title: post.title || defaultMetaData.title,
    description: post.preview || undefined,
  };
}
