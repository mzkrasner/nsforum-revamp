import useAuth from "@/shared/hooks/useAuth";
import useCategories from "@/shared/hooks/useCategories";
import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/orbis/utils";
import { PostFormType, postSchema } from "@/shared/schema/post";
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

  const orbis = useOrbis();
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

  const submitFn = async (values: any) => {
    if (!orbis || !values) return;
    await connectOrbis(); // Does nothing if user is already connected
    if (!orbis.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }
    const { title, body, category, status, tags } = values;
    const insertValue = {
      title,
      body,
      category,
      tags: JSON.stringify(tags),
      status,
    };
    let statement;
    if (postId) {
      // Update existing post
      statement = orbis.update(postId).set(insertValue);
    } else {
      // Create new post
      statement = orbis
        .insert(process.env.NEXT_PUBLIC_POSTS_MODEL!)
        .value(insertValue);

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

  const submitMutation = useMutation({
    mutationKey: ["create-post"],
    mutationFn: submitFn,
    onSuccess: (result?: CeramicDocument) => {
      if (!result) return;
      router.push(`/posts/${result.id}`);
    },
    onError: console.error,
  });

  return { form, orbis, categories, submitMutation };
};

export default usePostForm;
