import { revalidateTagFromClient } from "@/shared/actions/reactions";
import useCategories from "@/shared/hooks/useCategories";
import useProfile from "@/shared/hooks/useProfile";
import {
  generateRandomAlphaNumString,
  getHtmlContentPreview,
} from "@/shared/lib/utils";
import { orbisdb } from "@/shared/orbis";
import { createPost, updatePost } from "@/shared/orbis/mutations";
import { fetchPost } from "@/shared/orbis/queries";
import { postFormSchema, PostFormType, PostStatus } from "@/shared/schema/post";
import { OrbisDBRow } from "@/shared/types";
import { Post } from "@/shared/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import usePost from "../../_hooks/usePost";

type Props = { isEditing?: boolean };
const usePostForm = ({ isEditing }: Props) => {
  const router = useRouter();

  const { categories } = useCategories();
  const { profile } = useProfile();

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      body: "",
      category: undefined,
      tag_ids: [],
      status: "published",
    } as Partial<PostFormType>,
  });
  const { setValue, reset } = form;

  const { postQuery, postQueryKey } = usePost();
  const { data: post, isLoading: isLoadingPost } = postQuery;
  const postId = post?.stream_id;

  // Initialize form with post and clear on unmount
  useEffect(() => {
    if (!isEditing || !postId || isLoadingPost || !post) return;
    const { title, body, category, status, tag_ids, slug } = post;
    setValue("slug", slug);
    setValue("title", title);
    setValue("body", body);
    setValue("category", category);
    setValue("status", status);
    setValue("tag_ids", tag_ids || []);
  }, [postId, post, setValue, isLoadingPost, reset, isEditing]);

  // Initialize author name
  useEffect(() => {
    if (profile?.name) setValue("author_username", profile.username);
  }, [profile, setValue]);

  const createPostSlug = async (
    title: string,
    appendRandomString: boolean = false,
  ) => {
    let slug =
      title
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing spaces
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") + // Remove multiple consecutive hyphens
      (appendRandomString ? generateRandomAlphaNumString(4) : "");
    const slugExists = await fetchPost({ filter: { slug } });
    if (slugExists) return await createPostSlug(title, true);
    return slug;
  };

  const saveFn = async (
    formValues: PostFormType,
    status: PostStatus = "published",
  ) => {
    if (!formValues) return;
    if (!orbisdb.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }
    const { body, title } = formValues;
    const preview = getHtmlContentPreview(body);
    const slug = formValues.slug || (await createPostSlug(title));
    const values = { ...formValues, preview, status, slug };
    if (isEditing) {
      if (!postId)
        throw new Error(
          "No postId. Cannot update post without it's stream_id)",
        );
      return await updatePost({
        postId,
        values,
      });
    }
    return await createPost({ values });
  };

  const publishMutation = useMutation({
    mutationKey: ["publish-post"],
    mutationFn: saveFn,
    onSuccess: async (result) => {
      if (!result) return;
      queryClient.invalidateQueries({
        queryKey: postQueryKey,
      });
      queryClient.setQueryData(
        postQueryKey,
        produce((oldPost: OrbisDBRow<Post>) => {
          if (oldPost) Object.assign(oldPost, result.content);
        }),
      );
      // Revalidate posts
      await revalidateTagFromClient("homepage-posts");
      if (isEditing && post?.slug) {
        // Revalidate post page
        await revalidateTagFromClient(post.slug);
      }
      router.push(`/posts/${result?.content?.slug}`);
    },
    onError: console.error,
  });

  const draftFn = async (values: PostFormType) => await saveFn(values, "draft");

  const draftMutation = useMutation({
    mutationKey: ["draft-post"],
    mutationFn: draftFn,
    onSuccess: (result?: CeramicDocument) => {
      if (!result) return;
      router.push("/profile");
    },
    onError: console.error,
  });

  return { form, categories, publishMutation, draftMutation };
};

export default usePostForm;
