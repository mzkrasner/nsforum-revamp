import PostList from "@/shared/components/PostList";
import { Button } from "@/shared/components/ui/button";
import { fetchPosts } from "@/shared/orbis/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import Header from "./_components/Header";
import PostFilters from "./_components/PostFilters";
import { config } from "./_providers/react-query/config";

const HomePage = async () => {
  const queryClient = new QueryClient(config);

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchPosts({ page: pageParam }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mb-10">
        <Header />
        <div className="md:grid md:grid-cols-[1fr_320px]">
          <section className="container">
            <div className="mb-5 flex items-center justify-between">
              <PostFilters />
              <Button size="sm" asChild>
                <Link href="/posts/new">Create Post</Link>
              </Button>
            </div>
            <PostList />
          </section>
        </div>
      </main>
    </HydrationBoundary>
  );
};

export default HomePage;
