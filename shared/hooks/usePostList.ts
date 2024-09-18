import { FetchPostsOptions, fetchPosts } from "@/shared/orbis/queries";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";

type Props = {
  fetchPostsOptions?: FetchPostsOptions;
  initialData?: InfiniteData<OrbisDBRow<Post>[], number>;
};
const usePostList = ({ fetchPostsOptions, initialData }: Props = {}) => {
  const postListQuery = useInfiniteQuery({
    initialData,
    queryKey: ["posts", fetchPostsOptions],
    queryFn: ({ pageParam }) =>
      fetchPosts({ page: pageParam, ...fetchPostsOptions }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  const { data } = postListQuery;

  const posts = data?.pages.map((page) => page).flat() || [];

  return { posts, postListQuery };
};

export default usePostList;
