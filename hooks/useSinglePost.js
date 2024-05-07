import { useRouter, useSearchParams } from "next/navigation";
import { useOrbis } from "@orbisclub/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import loadSinglePost from "../controllers/loadSinglePost";
import axios from "axios";
import { cloneDeep } from "lodash-es";
import { sleep } from "../utils";
import usePosts from "./usePosts";

const useSinglePost = (props = {}) => {
	const { orbis, user } = useOrbis();
	const { did = "" } = user || {};

	const router = useRouter();
	const searchParams = useSearchParams();
	const postId = props.postId || searchParams.get("post_id");

	const { sortOption } = usePosts();

	const queryClient = useQueryClient();
	const queryKey = ["post", { postId }];

	const getPost = async ({ queryKey }) => {
		const [_, { postId }] = queryKey;
		if (!postId) return null;
		const post = await loadSinglePost(postId);
		return post || null;
	};

	const {
		data: post,
		isLoading,
		isFetching,
	} = useQuery({
		queryKey,
		queryFn: getPost,
	});

	const onPostChangeMutation = useMutation({
		mutationKey: ["revalidate-post", { postId }],
		mutationFn: async ({ postId, isUpdate } = { postId, isUpdate: true }) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0] === "posts" && !!query.queryKey[1]?.sortOption,
			});
			if (isUpdate) {
				// Refetch post
				queryClient.invalidateQueries({
					queryKey: cloneDeep(queryKey),
				});
			} else {
				// Prefetch post
				queryClient.prefetchQuery({
					queryKey: cloneDeep(queryKey),
					queryFn: getPost,
				});
			}
		},
		retry: 3,
	});

	const editPost = async (newContent) => {
		if (!did) throw new Error("You must be logged in to create a post");
		if (!postId) throw new Error("Post id was not passed");
		const content = { ...post.content, ...newContent };
		const res = await orbis.editPost(postId, content);
		await sleep(1500);
		await axios.post(
			`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/post/sync`,
			{
				postId,
			}
		);
		if (res.status != 200) return null;
		await onPostChangeMutation.mutateAsync({ postId, isUpdate: true });
		return newContent;
	};

	const editPostMutation = useMutation({
		mutationKey: ["edit-post", { postId }],
		mutationFn: editPost,
		onSuccess: (newContent) => {
			if (!newContent) return null;
			// Optimistic update
			const newPost = cloneDeep({ ...post, content: newContent });
			queryClient.setQueryData(cloneDeep(queryKey), newPost);

			queryClient.setQueryData(
				["posts", { sortOption }, { sortOption }],
				(data) => {
					return {
						...data,
						pages: data?.pages.map((page) => {
							return page.map((post) => {
								if (post.stream_id === postId) return newPost;
								return post;
							});
						}),
					};
				}
			);
			queryClient.setQueryData;
			router.push(`/post/${postId}`);
		},
	});

	const createPost = async (content) => {
		if (!did) throw new Error("You must be logged in to create a post");
		const res = await orbis.createPost(content);
		const postId = res.doc;
		await sleep(1500);
		await axios.post(
			`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/post/sync`,
			{
				postId,
			}
		);
		if (res.status != 200) return null;
		await onPostChangeMutation.mutateAsync({
			postId,
			isUpdate: false,
		});
		return res;
	};

	const createPostMutation = useMutation({
		mutationKey: ["create-post"],
		mutationFn: createPost,
		onSuccess: (res) => {
			if (!res) return;
			queryClient.invalidateQueries({
				queryKey: ["posts", { sortOption }],
				exact: true,
			});
			router.push(`/post/${res.doc}`);
		},
	});

	const deletePost = async (postId) => {
		let res;
		try {
			res = await orbis.deletePost(postId);
			await axios.delete(
				`https://t25ubql6ra.execute-api.us-east-1.amazonaws.com/post/${postId}`
			);
			await sleep(1500);
		} catch (error) {
			console.log(error);
		}
		queryClient.invalidateQueries({ queryKey: ["posts"] });
		router.push("/");
	};

	const deletePostMutation = useMutation({
		mutationKey: ["delete-post", { postId }],
		mutationFn: deletePost,
	});

	const getReaction = async () => {
		if (!did || !postId) return null;
		const res = await axios.get(
			`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/post/${postId}/get-reaction`,
			{
				params: { userId: did },
			}
		);
		if (res.status === 200 && !res.error) {
			return res.data?.type || null;
		} else {
			throw new Error(res.error || "An error occured while creating comments");
		}
	};

	const reactionQuery = useQuery({
		queryKey: ["post-reaction", { postId, userDid: did }],
		queryFn: getReaction,
	});

	const reactToPost = async (reaction) => {
		if (
			!user?.metadata?.address ||
			reaction === reactionQuery.data ||
			!["like", "downvote"].includes(reaction)
		)
			return;
		const res = await axios.post(
			`https://s5n3r9eg8h.execute-api.us-east-1.amazonaws.com/post/${postId}/react`,
			{
				userId: did,
				postId,
				type: reaction,
				userAddress: user.metadata.address,
			}
		);
		if (res.status === 200 && !res.error) {
			return reaction;
		} else {
			throw new Error(res.error || "An error occured while creating comments");
		}
	};

	// React to post
	const reactToPostMutation = useMutation({
		mutationKey: ["react-to-post", { postId }],
		mutationFn: reactToPost,
		onSuccess: async (reaction) => {
			if (post) {
				queryClient.setQueryData(cloneDeep(queryKey), () => {
					const lastReaction = reactionQuery.data;
					const newPost = post;
					if (reaction === "like") {
						if (lastReaction === "downvote" && post.count_downvotes > 0) {
							newPost.count_downvotes = post.count_downvotes - 1;
						}
						newPost.count_likes = post.count_likes + 1;
					}
					if (reaction === "downvote") {
						if (lastReaction === "like" && post.count_likes > 0) {
							newPost.count_likes = post.count_likes - 1;
						}
						newPost.count_downvotes = post.count_downvotes + 1;
					}
					return newPost;
				});
			}
			queryClient.setQueryData(
				["post-reaction", { postId, userDid: did }],
				reaction
			);
		},
	});

	return {
		post,
		loading: isLoading,
		fetching: isFetching,
		editPostMutation,
		createPostMutation,
		deletePostMutation,
		reactionQuery,
		reactToPostMutation,
	};
};

export default useSinglePost;
