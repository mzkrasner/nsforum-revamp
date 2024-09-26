import { useInfiniteQuery } from "@tanstack/react-query";
import { isNil, omitBy } from "lodash-es";
import { fetchComments, FetchCommentsArg } from "../orbis/queries";

type Props = {
  fetchCommentsArg: FetchCommentsArg;
};

const useCommentList = (props: Props) => {
  const { fetchCommentsArg } = props;

  const queryKey = ["comments", omitBy(fetchCommentsArg, isNil)];
  const commentListQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchComments({
        ...fetchCommentsArg,
        pagination: { page: pageParam, ...(fetchCommentsArg.pagination || {}) },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  const { data } = commentListQuery;

  const comments =
    commentListQuery.data?.pages.map((page) => page).flat() || [];

  return { comments, commentListQuery };
};

export default useCommentList;
