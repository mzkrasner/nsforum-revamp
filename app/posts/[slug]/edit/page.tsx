"use client";

import { useParams } from "next/navigation";
import PostForm from "../../_components/PostForm";

const EditPostPage = () => {
  const params = useParams();
  const postId = params.postId;
  return (
    <div className="container flex flex-1 flex-col py-10">
      <PostForm postId={postId as string} />
    </div>
  );
};
export default EditPostPage;
