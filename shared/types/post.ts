import { PostStatus } from "../schema/post";

export type Post = {
  title: string;
  body: string;
  category: string;
  tags: string[];
  status: PostStatus;
  stream_id?: string;
  metadata: {
    created_at: string;
    updated_at: string;
  } | null;
};
