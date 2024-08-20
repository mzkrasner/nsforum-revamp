import { FetchPostOptions, fetchPosts } from "@/shared/orbis/queries";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = { fetchPostOptions?: FetchPostOptions };
const usePostList = (props?: Props) => {
  const { fetchPostOptions } = props || {};

  const postListQuery = useInfiniteQuery({
    queryKey: ["posts", fetchPostOptions],
    queryFn: ({ pageParam }) =>
      fetchPosts({ page: pageParam, ...fetchPostOptions }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  return { postListQuery };
};

export default usePostList;
