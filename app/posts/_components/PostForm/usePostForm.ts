import useAuth from "@/shared/hooks/useAuth";
import useCategories from "@/shared/hooks/useCategories";
import useOrbis from "@/shared/hooks/useOrbis";
import { models } from "@/shared/orbis";
import { catchError } from "@/shared/orbis/utils";
import { PostFormType, postSchema, PostStatus } from "@/shared/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
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

  const form = useForm({
    resolver: zodResolver(postSchema),
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
    const { title, body, category, status, tags } = post;
    setValue("title", title);
    setValue("body", body);
    setValue("category", category);
    setValue("status", status);
    setValue("tags", tags || []);
  }, [postId, post, setValue, isLoadingPost]);

  // This is done automatically but I have to ensure it can be queried
  // // Get author from orbis
  // useEffect(() => {
  //   const addAuthor = async () => {
  //     const orbisUser = (await orbis?.getConnectedUser()) as
  //       | { user: { did: string } }
  //       | undefined;
  //     const did = orbisUser?.user?.did;
  //     if (did && !authors.includes(did)) setValue("authors", [...authors, did]);
  //   };
  //   addAuthor();
  // }, [orbis, authors, watch, setValue]);

  const saveFn = async (
    values: PostFormType,
    status: PostStatus = "published",
  ) => {
    if (!db || !values) return;
    await connectOrbis(); // Does nothing if user is already connected
    if (!db.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }
    let statement;
    if (postId) {
      // Update existing post
      statement = db.update(postId).set({ ...values, status });
    } else {
      // Create new post
      statement = db.insert(models.posts).value({ ...values, status });

      const validation = await statement.validate();
      if (!validation.valid) {
        throw new Error(
          `Error during create post validation: ${validation.error}`,
        );
      }
    }
    const [result, error] = await catchError(() => statement.run());
    if (error) throw new Error(`Error during create post query: ${error}`);
    if (!result) throw new Error("No result was returned from orbis");
    return result;
  };

  const publishMutation = useMutation({
    mutationKey: ["publish-post"],
    mutationFn: saveFn,
    onSuccess: (result?: CeramicDocument) => {
      if (!result) return;
      router.push(`/posts/${result.id}`);
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
