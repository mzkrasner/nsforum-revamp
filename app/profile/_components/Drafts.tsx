"use client";

import PostList from "@/shared/components/PostList";
import useProfile from "@/shared/hooks/useProfile";

const Drafts = () => {
  const { profile } = useProfile();
  if (!profile) return null;
  const { controller } = profile;
  return (
    <PostList
      fetchPostsOptions={{ filter: { controller, status: "draft" } }}
      emptyContent={
        <div className="py-10 text-center text-neutral-500">No draft found</div>
      }
    />
  );
};
export default Drafts;
