import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/lib/orbis/utils";
import { Post } from "@/shared/schema/post";
import { useQuery } from "@tanstack/react-query";
import { CeramicDocument } from "@useorbis/db-sdk";
import { useParams } from "next/navigation";

const usePost = () => {
  const params = useParams();
  const postId = params.postId;

  const orbis = useOrbis();

  const fetchPost = async () => {
    const selectStatement = orbis
      ?.select()
      .from(process.env.NEXT_PUBLIC_POSTS_MODEL!)
      .where({
        stream_id:
          "kjzl6kcym7w8y5dsrh02ynq124ivpl3k0dvidagrqgscxyiao6ibfaacb7fupzt",
      });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching post: ${error}`);
    if (!result?.rows.length)
      throw new Error(`Error while fetching post: Post not found`);
    return result.rows[0] as Post & CeramicDocument["content"];
  };

  const postQuery = useQuery({
    queryKey: ["post", { postId }],
    queryFn: fetchPost,
  });

  return { postQuery };
};

export default usePost;
