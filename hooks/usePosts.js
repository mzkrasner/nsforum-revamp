// Handles requests for fetching multiple posts
import { useInfiniteQuery } from '@tanstack/react-query'
import loadPosts from '../controllers/loadPosts'

const usePosts = (props = {}) => {
  const { initialPage = 0 } = props

  const getPosts = async ({ pageParam }) => {
    const posts = await loadPosts(global.orbis_context, false, pageParam);
    return posts;
  }

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialPageParam: initialPage,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage.length) return undefined;
      return lastPageParam + 1
    },
    // getPreviousPageParam: (firstPage, allPages, firstPageParam, allPageParams) => {
    //   console.log()
    // },
    select: (data) => ({
      ...data,
      allItems: Object.values(data.pages).flat(),
    })
  });

  return {
    posts: data?.allItems || [],
    loading: isLoading,
    fetching: isFetching,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage
  }
}

export default usePosts;