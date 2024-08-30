import { PostStatus } from "../schema/post";

export type Post = {
  slug: string;
  author_name: string;
  preview: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  status: PostStatus;
  stream_id?: string;
};
