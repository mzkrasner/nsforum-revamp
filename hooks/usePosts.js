// Handles requests for fetching multiple posts
import { useInfiniteQuery } from "@tanstack/react-query";
import loadPosts from "../controllers/loadPosts";
import preloadPosts from "../controllers/preloadPosts";
import { useState } from "react";

const SORT_OPTIONS = [
	{
		name: "Newest to oldest",
		field: "timestamp",
		order: -1,
		key: 0,
	},
	{
		name: "Oldest to Newest",
		field: "timestamp",
		order: 1,
		key: 1,
	},
	{
		name: "Most upvoted",
		field: "count_likes",
		order: 1,
		key: 2,
	},
];

const usePosts = (props = {}) => {
	const [sortOption, setSortOption] = useState(SORT_OPTIONS[1]);

	const { initialPage = 0 } = props;

	const getPosts = async ({ pageParam }) => {
		console.log("Fetching for page: ", pageParam);
		// const posts = await loadPosts(global.orbis_context, false, pageParam);
		const { field: sortField, order: sortOrder } = sortOption;
		const posts = await preloadPosts({
			context: global.orbis_context,
			page: pageParam,
			sortField,
			sortOrder,
		});
		return posts;
	};

	const {
		data,
		isLoading,
		isFetching,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage,
	} = useInfiniteQuery({
		queryKey: ["posts", { sortOption }],
		queryFn: getPosts,
		initialPageParam: initialPage,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			if (!lastPage.length) return undefined;
			return lastPageParam + 1;
		},
		// getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => {
		//   console.log()
		// },
		select: (data) => ({
			...data,
			allItems: Object.values(data.pages).flat(),
		}),
	});

	return {
		posts: data?.allItems || [],
		loading: isLoading,
		fetching: isFetching,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage,
		sortOptions: SORT_OPTIONS,
		sortOption,
		setSortOption,
	};
};

export default usePosts;
