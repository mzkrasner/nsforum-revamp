"use client";

import PostForm from "../../_components/PostForm";

const EditPostPage = () => {
  return (
    <div className="container flex flex-1 flex-col py-10">
      <PostForm isEditing />
    </div>
  );
};
export default EditPostPage;
