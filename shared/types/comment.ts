import { PostStatus } from "../schema/post";

export type CommentType = {
  user: {
    username: string;
    did: string;
  };
  body: string;
  postId: string;
  topParentId: string;
  parentId: string;
  status: PostStatus;
};
