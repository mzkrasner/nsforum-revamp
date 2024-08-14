import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Header from "./_components/Header";
import PostList from "./_components/PostList";
import { fetchPostList } from "./_components/PostList/usePostList";

const HomePage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    initialPageParam: 0,
    queryKey: ["posts"],
    queryFn: fetchPostList,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="mb-10">
        <Header />
        <div className="md:grid md:grid-cols-[1fr_320px]">
          <PostList />
        </div>
      </main>
    </HydrationBoundary>
  );
};

export default HomePage;
