import { fetchUser } from "@/shared/orbis/queries";
import { cache, PropsWithChildren } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: { did: string };
}) => {
  const did = params?.did;
  const defaultMetaData = {
    title: "User",
  };
  if (!did) return defaultMetaData;

  const cachedFetchUser = cache(
    async () =>
      await fetchUser({
        controller: decodeURIComponent(did) as string,
      }),
  );

  const user = await cachedFetchUser();
  if (!user) return defaultMetaData;

  return {
    title: user.name || defaultMetaData.title,
  };
};

const ProfileLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto max-w-[600px] flex-1 pb-10">
      {children}
    </div>
  );
};
export default ProfileLayout;
