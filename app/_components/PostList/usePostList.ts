import { fetchPosts } from "@/shared/orbis/posts";
import { useInfiniteQuery } from "@tanstack/react-query";

const usePostList = () => {
  const postListQuery = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => undefined,
  });

  return { postListQuery };
};

export default usePostList;
