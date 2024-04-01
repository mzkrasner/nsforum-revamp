import { useRouter } from 'next/navigation';
import { useOrbis } from '@orbisclub/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import loadSinglePost from '../controllers/loadSinglePost';
import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import { sleep } from '../utils';

const useSinglePost = (props = {}) => {
  const { postId = '' } = props;
  const { orbis, user } = useOrbis();

  const router = useRouter();

  const queryClient = useQueryClient();
  const queryKey = ['post', { postId }];

  const getPost = async ({ queryKey }) => {
    const [_, { postId }] = queryKey;
    if (!postId) return null;
    const post = await loadSinglePost(postId);
    return post || null;
  }

  const { data: post, isLoading, isFetching } = useQuery({
    queryKey,
    queryFn: getPost
  })

  const onPostChangeMutation = useMutation({
    mutationKey: ['revalidate-post', { postId }],
    mutationFn: async ({ postId, isUpdate } = { postId, isUpdate: true }) => {
      // Regenerate the post page
      const res = await axios.post(`/api/revalidate/post/${postId}`);
      await sleep(1500);
      if (isUpdate) {
        // Refetch post
        queryClient.invalidateQueries({
          queryKey: cloneDeep(queryKey)
        });
      } else {
        // Prefetch post
        queryClient.prefetchQuery({
          queryKey: cloneDeep(queryKey),
          queryFn: getPost
        })
      }
      return res;
    },
    retry: 3
  })

  const editPost = async (newContent) => {
    if (!postId) return null;
    const content = { ...post.content, ...newContent }
    const res = await orbis.editPost(postId, content);
    if (res.status != 200) return null
    return newContent;
  }

  const editPostMutation = useMutation({
    mutationKey: ['edit-post', { postId }],
    mutationFn: editPost,
    onSuccess: (newContent) => {
      if (!newContent) return null;
      // Optimistic update
      queryClient.setQueryData(cloneDeep(queryKey), cloneDeep({ ...post, content: newContent }));
      onPostChangeMutation.mutate({ postId, isUpdate: true });
      router.push(`/post/${postId}`);
    },
  })

  const createPost = async (content) => {
    const res = await orbis.createPost(content);
    await sleep(1500);
    if (res.status != 200) return null
    return res;
  }

  const createPostMutation = useMutation({
    mutationKey: ['create-post'],
    mutationFn: createPost,
    onSuccess: (res) => {
      if (!res) return;
      onPostChangeMutation.mutate({ postId: res.doc, isUpdate: false });
      router.push(`/post/${res.doc}`);
    }
  })

  const deletePost = async () => {
    const res = await orbis.deletePost(postId);
    if (res.status != 200) return null;
    return res;
  };

  const deletePostMutation = useMutation({
    mutationKey: ['delete-post', { postId }],
    mutationFn: deletePost,
    onSuccess: (res) => {
      if (!res) return;
      queryClient.invalidateQueries({ queryKey: cloneDeep(queryKey), exact: true })
      router.push('/');
    }
  })

  const getReaction = async () => {
    if (!user?.did) return null;
    const res = await orbis.getReaction(postId, user.did);
    if (res.status === 200 && !res.error) {
      return res.data?.type || null;
    } else {
      throw new Error(res.error || 'An error occured while creating comments');
    }
  };

  const reactionQuery = useQuery({
    queryKey: ['post-reaction', { postId, userDid: user?.did }],
    queryFn: getReaction
  })

  const reactToPost = async (reaction) => {
    if (reaction === reactionQuery.data || !['like', 'downvote'].includes(reaction)) return;
    let res = await orbis.react(postId, reaction);
    if (res.status === 200 && !res.error) {
      return reaction;
    } else {
      throw new Error(res.error || 'An error occured while creating comments');
    }
  };

  // React to post
  const reactToPostMutation = useMutation({
    mutationKey: ['react-to-post', { postId }],
    mutationFn: reactToPost,
    onSuccess: (reaction) => {
      if (post) {
        queryClient.setQueryData(cloneDeep(queryKey), () => {
          const lastReaction = reactionQuery.data;
          const newPost = post;
          if (reaction === 'like') {
            if (lastReaction === 'downvote' && post.count_downvotes > 0) {
              newPost.count_downvotes = post.count_downvotes - 1;
            }
            newPost.count_likes = post.count_likes + 1;
          }
          if (reaction === 'downvote') {
            if (lastReaction === 'like' && post.count_likes > 0) {
              newPost.count_likes = post.count_likes - 1;
            }
            newPost.count_downvotes = post.count_downvotes + 1;
          }
          return newPost;
        });
      }
      queryClient.setQueryData(
        ['post-reaction', { postId, userDid: user?.did }],
        reaction
      );
    },
  })

  return {
    post,
    loading: isLoading,
    fetching: isFetching,
    editPostMutation,
    createPostMutation,
    deletePostMutation,
    reactionQuery,
    reactToPostMutation
  }
}

export default useSinglePost