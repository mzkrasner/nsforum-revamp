import { PostStatus } from "../schema/post";

export type CommentType = {
  author: {
    username: string;
    did: string;
  };
  body: string;
  post_id: string;
  parent_ids: string;
  status: PostStatus;
};
