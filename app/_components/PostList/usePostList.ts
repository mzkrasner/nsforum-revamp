import { fetchPosts } from "@/shared/orbis/server-queries";
import { useInfiniteQuery } from "@tanstack/react-query";

export const fetchPostList = async ({ pageParam }: { pageParam: number }) => {
  return await fetchPosts(
    { page: pageParam },
    { fields: ["title", "category", "tags", "controller", "indexed_at"] },
  );
};

const usePostList = () => {
  const postListQuery = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPostList,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  return { postListQuery };
};

export default usePostList;
