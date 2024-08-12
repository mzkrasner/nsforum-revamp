import useAuth from "@/shared/hooks/useAuth";
import useCategories from "@/shared/hooks/useCategories";
import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/lib/orbis/utils";
import { postSchema } from "@/shared/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallets } from "@privy-io/react-auth";
import { useMutation } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = { postId?: string };
const usePostForm = ({ postId }: Props) => {
  const router = useRouter();

  const orbis = useOrbis();
  const { categories } = useCategories();
  const { wallets } = useWallets();
  const { connectOrbis } = useAuth();

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "Post title",
      body: "Post body",
      category: "1",
      tags: ["0", "1"] as string[],
      authors: [] as string[],
    },
  });
  const { watch, setValue } = form;
  const authors = watch("authors");

  // Get author from orbis
  useEffect(() => {
    const addAuthor = async () => {
      const orbisUser = (await orbis?.getConnectedUser()) as
        | { user: { did: string } }
        | undefined;
      const did = orbisUser?.user?.did;
      if (did && !authors.includes(did)) setValue("authors", [...authors, did]);
    };
    addAuthor();
  }, [orbis, authors, watch, setValue]);

  const submitFn = async (values: any) => {
    if (!orbis || !values) return;
    if (!values?.authors?.length) {
      // This will only run if user is not connected to orbis
      const wallet = wallets.find((w) => !w.imported);
      if (!wallet) throw new Error("No wallet found");
      const authResult = (await connectOrbis(wallet)) as
        | { user: { did: string } }
        | undefined;
      const did = authResult?.user?.did;
      if (!did) throw new Error("Unable to connect");
      values.authors = [did];
    }
    const { title, body, category, authors, tags } = values;
    const insertStatement = orbis
      .insert(process.env.NEXT_PUBLIC_POSTS_MODEL!)
      .value({
        title,
        body,
        category,
        tags: JSON.stringify(tags),
        authors: JSON.stringify(authors),
      });
    const validation = await insertStatement.validate();
    if (!validation.valid) {
      throw new Error(
        `Error during create post validation: ${validation.error}`,
      );
    }
    const [result, error] = await catchError(() => insertStatement.run());
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
    onError: console.log,
  });

  return { form, orbis, categories, submitMutation };
};

export default usePostForm;
