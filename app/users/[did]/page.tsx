"use client";

import SectionHeading from "@/shared/components/SectionHeading";
import useUser from "@/shared/hooks/useUser";
import { useParams } from "next/navigation";
import Posts from "./_components/Posts";
import UserInfo from "./_components/UserInfo";

const UserPage = () => {
  const params = useParams();
  const did = decodeURIComponent(params.did as string) as string;

  const { user, query } = useUser({ did });

  if (query.isLoading) return "Loading...";

  if (!user) return null;

  return (
    <div className="pt-10">
      <UserInfo did={did} />
      <section className="mt-10">
        <SectionHeading>Posts</SectionHeading>
        <Posts did={did} />
      </section>
    </div>
  );
};
export default UserPage;
