import { useInfiniteQuery } from "@tanstack/react-query";
import { ilike } from "@useorbis/db-sdk/operators";
import { useMemo, useState } from "react";
import { escapeSQLLikePattern } from "../lib/utils";
import { fetchTags, FetchTagsOptions } from "../orbis/queries";

type Props = { fetchTagsOptions?: FetchTagsOptions };
const useTags = (
  { fetchTagsOptions: _fetchTagsOptions }: Props = { fetchTagsOptions: {} },
) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchTagsOptions = useMemo(() => {
    if (_fetchTagsOptions && searchTerm)
      return {
        ..._fetchTagsOptions,
        filter: {
          ...(_fetchTagsOptions.filter || {}),
          name: ilike(`%${escapeSQLLikePattern(searchTerm)}%`),
        } as FetchTagsOptions,
      };
    return _fetchTagsOptions;
  }, [_fetchTagsOptions, searchTerm]);

  const tagsQuery = useInfiniteQuery({
    queryKey: ["tags", fetchTagsOptions],
    queryFn: async ({ pageParam }) => {
      return await fetchTags({ page: pageParam, ...fetchTagsOptions });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length ? pages.length : undefined;
    },
  });
  const { data } = tagsQuery;

  const tags = data?.pages.map((page) => page).flat() || [];

  return { tags, tagsQuery, searchTerm, setSearchTerm };
};

export default useTags;
