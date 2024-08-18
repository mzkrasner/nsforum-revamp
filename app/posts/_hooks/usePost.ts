import useAuth from "@/shared/hooks/useAuth";
import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/orbis/utils";
import { Post, PostStatus } from "@/shared/schema/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
import { useParams, useRouter } from "next/navigation";

const usePost = () => {
  const router = useRouter();

  const params = useParams();
  const postId = params.postId;

  const orbis = useOrbis();
  const { connectOrbis } = useAuth();

  const queryClient = useQueryClient();

  const fetchPost = async () => {
    if (!postId) throw new Error("Cannot fetch post without postId");
    const selectStatement = orbis
      ?.select()
      .from(process.env.NEXT_PUBLIC_POSTS_MODEL!)
      .where({
        stream_id: postId,
      });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching post: ${error}`);
    if (!result?.rows.length)
      throw new Error(`Error while fetching post: Post not found`);
    const { tags, ...rest } = result.rows[0];
    const post = {
      ...rest,
      tags: tags ? JSON.parse(tags) : [],
    };
    return post as Post & CeramicDocument["content"];
  };

  const postQuery = useQuery({
    queryKey: ["post", { postId }],
    queryFn: fetchPost,
  });

  const deletePost = async (postId: string) => {
    // Orbis does not support delete statements yet
    // To delete a post change the deleted field to true
    if (!orbis) return;
    await connectOrbis(); // Does nothing if user is already connected
    if (!orbis.getConnectedUser()) {
      throw new Error("Cannot create a post without connection to orbis");
    }

    const insertStatement = orbis
      .update(postId)
      .set({ status: "deleted" as PostStatus });
    const [result, error] = await catchError(() => insertStatement.run());
    if (error) throw new Error(`Error during create post query: ${error}`);
    if (!result) throw new Error("No result was returned from orbis");
    return result;
  };

  const deletePostMutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.setQueryData(["post", { postId }], (post: Post) => ({
        ...post,
        status: "deleted",
      }));
      queryClient.removeQueries({
        queryKey: ["post", { postId }],
        exact: true,
      });
      router.push("/");
    },
  });

  return { postQuery, deletePostMutation };
};

export default usePost;
