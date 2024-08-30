import useAuth from "@/shared/hooks/useAuth";
import useCategories from "@/shared/hooks/useCategories";
import useOrbis from "@/shared/hooks/useOrbis";
import useProfile from "@/shared/hooks/useProfile";
import { generateRandomAlphaNumString } from "@/shared/lib/utils";
import { createPost, updatePost } from "@/shared/orbis/mutations";
import { fetchPost } from "@/shared/orbis/queries";
import { postFormSchema, PostFormType, PostStatus } from "@/shared/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
import { htmlToText } from "html-to-text";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import usePost from "../../_hooks/usePost";

type Props = { postId?: string };
const usePostForm = ({ postId }: Props) => {
  const router = useRouter();

  const { db } = useOrbis();
  const { categories } = useCategories();
  const { connectOrbis } = useAuth();
  const { profile } = useProfile();

  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      body: "",
      category: undefined,
      tags: [],
      status: "published",
    } as Partial<PostFormType>,
  });
  const { setValue } = form;

  const {
    postQuery: { data: post, isLoading: isLoadingPost },
  } = usePost();

  // Initialize form with post
  useEffect(() => {
    if (!postId || isLoadingPost || !post) return;
    const { title, body, category, status, tags, slug } = post;
    setValue("slug", slug);
    setValue("title", title);
    setValue("body", body);
    setValue("category", category);
    setValue("status", status);
    setValue("tags", tags || []);
  }, [postId, post, setValue, isLoadingPost]);

  // Initialize author name
  useEffect(() => {
    if (profile?.name) setValue("author_name", profile.name);
  }, [profile, setValue]);

  const getPostPreview = (body: string) => {
    const maxLength = 200;
    const text = htmlToText(body);
    if (text.length <= maxLength) {
      return text + "...";
    }
    return text.slice(0, maxLength) + "...";
  };

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
    const slugExists = await fetchPost({ slug });
    if (slugExists) return await createPostSlug(title, true);
    return slug;
  };

  const saveFn = async (
    formValues: PostFormType,
    status: PostStatus = "published",
  ) => {
    if (!db || !formValues) return;
    await connectOrbis(); // Does nothing if user is already connected
    if (!db.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }
    const { body, title } = formValues;
    const preview = getPostPreview(body);
    const slug = formValues.slug || (await createPostSlug(title));
    const values = { ...formValues, preview, status, slug };
    if (postId) {
      return await updatePost({
        orbisdb: db,
        postId,
        values,
      });
    }
    return await createPost({ orbisdb: db, values });
  };

  const publishMutation = useMutation({
    mutationKey: ["publish-post"],
    mutationFn: saveFn,
    onSuccess: async (result) => {
      if (!result) return;
      // // create notification
      // await axios.post("/api/notifications/posts", {
      //   authorId: profile?.stream_id,
      //   authorName: profile?.name,
      //   postId,
      // });
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

  return { form, db, categories, publishMutation, draftMutation };
};

export default usePostForm;
