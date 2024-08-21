import { useInfiniteQuery } from "@tanstack/react-query";
import { isNil, omitBy } from "lodash-es";
import { fetchComments, FetchCommentsOptions } from "../orbis/queries";

type Props = {
  fetchCommentsOptions: FetchCommentsOptions;
};

const useCommentList = (props: Props) => {
  const { fetchCommentsOptions } = props;

  const queryKey = ["comments", omitBy(fetchCommentsOptions, isNil)];
  // console.log("Comments query key: ", queryKey, fetchCommentsOptions);
  const commentListQuery = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      fetchComments({ page: pageParam, ...fetchCommentsOptions }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });

  return { commentListQuery };
};

export default useCommentList;
