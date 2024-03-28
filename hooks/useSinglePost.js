import { useRouter } from 'next/navigation';
import { useOrbis } from '@orbisclub/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import loadSinglePost from '../controllers/loadSinglePost';
import axios from 'axios';
import { cloneDeep } from 'lodash-es';
import { sleep } from '../utils';

const useSinglePost = (props = {}) => {
  const { postId = '' } = props;
  const { orbis } = useOrbis();

  const router = useRouter();

  const queryClient = useQueryClient();
  const queryKey = ['post', { postId }];

  const getPost = async ({ queryKey }) => {
    const [_, postId] = queryKey;
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
          queryKey: ['post', { postId }],
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

  return {
    post,
    loading: isLoading,
    fetching: isFetching,
    editPostMutation,
    createPostMutation,
    deletePostMutation
  }
}

export default useSinglePost