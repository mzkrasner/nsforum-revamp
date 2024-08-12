import useAuth from "@/shared/hooks/useAuth";
import useCategories from "@/shared/hooks/useCategories";
import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/lib/orbis/utils";
import { postSchema } from "@/shared/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallets } from "@privy-io/react-auth";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = { postId?: string };
const usePostForm = ({ postId }: Props) => {
  const orbis = useOrbis();
  const { categories } = useCategories();
  const { wallets } = useWallets();
  const { connectOrbis } = useAuth();

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      category: undefined,
      tags: [] as string[],
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
    if (!orbis) return;
    try {
      const { authors } = values;
      if (!authors?.length) {
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
      const insertStatement = orbis
        .insert(
          "kjzl6hvfrbw6cavxnkej30g3lroka708z25pfud1ei93x5rgc00hif4s7x1he18",
        )
        .value(values);
      const validation = await insertStatement.validate();
      if (!validation.valid) {
        throw new Error(`Error during validation: ${validation.error}`);
      }
      const [result, error] = await catchError(() => insertStatement.run());
      if (error) throw new Error(`Error during query: ${error}`);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const submitMutation = useMutation({
    mutationKey: ["create-post"],
    mutationFn: submitFn,
    onSuccess: console.log,
  });

  return { form, orbis, categories, submitMutation };
};

export default usePostForm;
