'use client'

import CommentForm from "@/shared/components/CommentForm";
import CommentList from "@/shared/components/CommentList";
import { useParams } from "next/navigation";

type Props = {}
const PostComments = (props: Props) => {
  const params = useParams();
  const postId = params.postId as string;
  return (
    <div>
      <div className="mt-10 mb-8">
        <CommentForm />
      </div>
      <CommentList fetchCommentsOptions={{ postId }} />
    </div>
  )
}
export default PostComments