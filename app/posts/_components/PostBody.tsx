"use client";

import htmlToReact from "@/shared/lib/htmlToReact";
import usePost from "../_hooks/usePost";

const PostBody = () => {
  const {
    postQuery: { isLoading, data },
  } = usePost();
  if (isLoading) return "Loading...";
  if (!data) return "No data found...";
  const { body } = data;
  return <div>{htmlToReact(body)}</div>;
};
export default PostBody;
