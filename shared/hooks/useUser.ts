import { useQuery } from "@tanstack/react-query";
import { models } from "../orbis";
import { catchError } from "../orbis/utils";
import useOrbis from "./useOrbis";

type Props = {
  did: string;
};

const useUser = ({ did }: Props) => {
  const { db } = useOrbis();

  const fetchUser = async () => {
    if (!did || !db) return null;
    const selectStatement = db.select().from(models.profiles).where({
      controller: "did:pkh:eip155:1:0x7201703a794e212645f1be4f6cff55a998c04bae",
    });
    const [result, error] = await catchError(() => selectStatement?.run());
    if (error) throw new Error(`Error while fetching user: ${error}`);
    if (!result?.rows.length) return null;
    const user = result.rows[0];
    return user;
  };

  const query = useQuery({
    queryKey: ["user", { did }],
    queryFn: fetchUser,
  });

  return { user: query.data, query };
};

export default useUser;
