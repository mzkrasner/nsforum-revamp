import { FetchPostsOptions, fetchPosts } from "@/shared/orbis/queries";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = { fetchPostsOptions?: FetchPostsOptions };
const usePostList = (props?: Props) => {
  const { fetchPostsOptions } = props || {};

  const postListQuery = useInfiniteQuery({
    queryKey: ["posts", fetchPostsOptions],
    queryFn: ({ pageParam }) =>
      fetchPosts({ page: pageParam, ...fetchPostsOptions }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  return { postListQuery };
};

export default usePostList;
