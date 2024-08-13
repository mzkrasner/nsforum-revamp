import { fetchPosts } from "@/shared/orbis/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Header from "./_components/Header";
import PostList from "./_components/PostList";

const HomePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Header />
        <div className="md:grid md:grid-cols-[1fr_320px]">
          <PostList />
        </div>
      </main>
    </HydrationBoundary>
  );
};

export default HomePage;
