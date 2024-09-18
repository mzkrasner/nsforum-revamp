import PostFilters from "@/shared/components/PostFilters";
import PostList from "@/shared/components/PostList";
import { Button } from "@/shared/components/ui/button";
import { slugToString } from "@/shared/lib/utils";
import { fetchPosts } from "@/shared/orbis/queries";
import { OrbisDBRow } from "@/shared/types";
import { Post } from "@/shared/types/post";
import { QueryClient } from "@tanstack/react-query";
import { like } from "@useorbis/db-sdk/operators";
import { isNil, omitBy } from "lodash-es";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import Header from "./_components/Header";
import { config } from "./_providers/react-query/config";

export const revalidate = 3600; // Every hour

type SortBy = "newest" | "oldest";
type Props = {
  searchParams: {
    category?: string;
    sortBy?: SortBy;
    [key: string]: string | string[] | undefined;
  };
};
const HomePage = async ({ searchParams }: Props) => {
  const { category = "", sortBy = "" } = searchParams;

  const queryClient = new QueryClient(config);
  const filter = omitBy(
    {
      category: category ? like(slugToString(category)) : undefined,
    },
    isNil,
  );

  const orderBy: [keyof OrbisDBRow<Post>, "asc" | "desc"][] | undefined =
    sortBy === "newest"
      ? [["indexed_at", "desc"]]
      : sortBy === "oldest"
        ? [["indexed_at", "asc"]]
        : undefined;

  const getInitialPostsData = unstable_cache(
    async () => {
      return await queryClient.fetchInfiniteQuery({
        initialPageParam: 0,
        queryKey: ["posts"],
        queryFn: ({ pageParam }) =>
          fetchPosts({ page: pageParam, filter, orderBy }),
      });
    },
    [category, sortBy],
    { tags: ["posts", "homepage-posts", category, sortBy] },
  );
  const initialPostsData = await getInitialPostsData();

  return (
    <>
      <Header />
      <section className="container mb-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 ml-auto flex flex-col items-end gap-5 xs:ml-0 xs:flex-row xs:justify-between">
            <PostFilters />
            <Button size="sm" asChild>
              <Link href="/posts/new">Create Post</Link>
            </Button>
          </div>
          <PostList
            fetchPostsOptions={{ filter, orderBy }}
            initialData={initialPostsData}
          />
        </div>
      </section>
    </>
  );
};

export default HomePage;
