import { FetchPostsOptions, fetchPosts } from "@/shared/orbis/queries";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";

type Props = {
  fetchPostsOptions?: FetchPostsOptions;
  initialData?: InfiniteData<OrbisDBRow<Post>[], number>;
  tags?: string[]; // pass to react-query queryKey, for invalidation
};
const usePostList = ({
  fetchPostsOptions,
  initialData,
  tags = [],
}: Props = {}) => {
  const postListQuery = useInfiniteQuery({
    initialData,
    queryKey: tags.length ? tags : ["posts", fetchPostsOptions],
    queryFn: async ({ pageParam }) => {
      return await fetchPosts({ page: pageParam, ...fetchPostsOptions });
    },
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
