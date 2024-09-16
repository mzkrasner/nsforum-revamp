import { orbisdb } from "@/shared/orbis";
import { fetchPost } from "@/shared/orbis/queries";
import { updateRow } from "@/shared/orbis/utils";
import { PostStatus } from "@/shared/schema/post";
import { Post } from "@/shared/types/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Level } from "@tiptap/extension-heading";
import { produce } from "immer";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export type PostHeadingTagName = "h2" | "h3" | "h4" | "h5" | "h6";
export type PostHeadingViewportPosition = "above" | "below" | "in-view";
export type PostHeading = {
  tagName: PostHeadingTagName;
  level: Level;
  textContent: string;
  id: string;
  viewportPosition?: PostHeadingViewportPosition;
};

const usePost = () => {
  const router = useRouter();

  const params = useParams();
  const slug = params.slug as string;

  const queryClient = useQueryClient();

  const queryOptions = { filter: { slug } };
  const postQuery = useQuery({
    queryKey: ["post", queryOptions],
    queryFn: async () => fetchPost(queryOptions),
  });

  const deletePost = async () => {
    // Orbis does not support delete statements yet
    // To delete a post change the deleted field to true
    const postId = postQuery.data?.stream_id;
    if (!postId) return;
    if (!orbisdb.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }

    return await updateRow<Post>({
      id: postId,
      set: { status: "deleted" as PostStatus },
    });
  };

  const deletePostMutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.setQueryData(["post", queryOptions], (post: any) => ({
        ...post,
        status: "deleted",
      }));
      queryClient.removeQueries({
        queryKey: ["post", queryOptions],
        exact: true,
      });
      router.push("/");
    },
  });

  const postHeadingsQuery = useQuery({
    queryKey: ["post-headings", queryOptions],
    initialData: [] as PostHeading[],
    enabled: false,
  });

  const addPostHeading = useCallback(
    (postHeading: PostHeading) => {
      const queryKey = ["post-headings", queryOptions];
      const existingHeadings: PostHeading[] | undefined =
        queryClient.getQueryData(queryKey);
      const alreadyAdded = !!existingHeadings?.find(
        (h) => h.id === postHeading.id,
      );
      if (!alreadyAdded) {
        queryClient.setQueryData(
          queryKey,
          produce((draft?: PostHeading[]) => {
            if (Array.isArray(draft)) draft.push(postHeading);
          }),
        );
      }
    },
    [queryClient],
  );

  const updateHeadingViewportPosition = useCallback(
    ({
      id,
      viewportPosition,
    }: {
      id: string;
      viewportPosition: PostHeadingViewportPosition;
    }) => {
      const queryKey = ["post-headings", queryOptions];
      queryClient.setQueryData(
        queryKey,
        produce((draft?: PostHeading[]) => {
          if (Array.isArray(draft)) {
            const heading = draft.find((h) => h.id === id);
            if (heading) heading.viewportPosition = viewportPosition;
          }
        }),
      );
    },
    [queryClient],
  );

  const postHeadings = postHeadingsQuery.data;
  const activePostHeadingId = useMemo(() => {
    const inViewHeading = postHeadings.find(
      (heading) => heading.viewportPosition === "in-view",
    );
    if (inViewHeading) {
      return inViewHeading.id;
    }

    const aboveHeadings = postHeadings.filter(
      (heading) => heading.viewportPosition === "above",
    );
    if (aboveHeadings.length > 0) {
      return aboveHeadings[aboveHeadings.length - 1].id;
    }

    return null; // or some fallback value if no headings match the criteria
  }, [postHeadings]);

  return {
    post: postQuery.data,
    postQuery,
    deletePostMutation,
    postHeadingsQuery,
    postHeadings,
    activePostHeadingId,
    addPostHeading,
    updateHeadingViewportPosition,
  };
};

export default usePost;
