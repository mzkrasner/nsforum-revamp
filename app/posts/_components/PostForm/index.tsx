"use client";

import CategorySelector from "@/shared/components/CategorySelector";
import RichTextEditor from "@/shared/components/RichTextEditor";
import SignInButton from "@/shared/components/SignInButton";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { usePrivy } from "@privy-io/react-auth";
import usePost from "../../_hooks/usePost";
import TagsSelector from "./components/TagsSelector";
import usePostForm from "./usePostForm";

type Props = { postId?: string };
const PostForm = ({ postId }: Props) => {
  const { authenticated, ready } = usePrivy();
  const { postQuery } = usePost();
  const { form, categories, submitMutation } = usePostForm({ postId });
  const { handleSubmit, control } = form;

  if (!authenticated)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
        <h3 className="font-medium">Sign in to create or edit posts</h3>
        {ready && <SignInButton variant="outline" className="mx-auto block" />}
      </div>
    );

  if (postQuery.isLoading) return "Loading...";

  return (
    <Form {...form}>
      <form
        className="mx-auto w-full max-w-[640px] space-y-5"
        onSubmit={handleSubmit((v: any) => submitMutation.mutate(v))}
      >
        <FormField
          control={control}
          name="title"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Post title"
                    rows={1}
                    className="min-h-12 font-serif text-3xl font-medium"
                    error={error}
                    autoGrow
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="body"
          render={({ field, fieldState: { error } }) => {
            const { onChange, value, ref } = field;
            return (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    placeholder="Post body"
                    ref={ref}
                    onChange={onChange}
                    value={value}
                    error={error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="category"
          render={({ field, fieldState: { error } }) => {
            const { onChange, value, ref } = field;
            const selectedCategory = categories.find(({ id }) => id === value);
            return (
              <FormItem>
                <FormControl>
                  <CategorySelector
                    ref={ref}
                    label="Select category"
                    selectedCategory={selectedCategory}
                    onSelect={({ id }) => onChange(id)}
                    error={error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="tags"
          render={({ field, fieldState: { error } }) => {
            const { value = [], onChange } = field;
            return (
              <FormItem>
                <FormControl>
                  <TagsSelector
                    selectedTags={value}
                    onChange={onChange}
                    error={error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          className="ml-auto flex"
          loading={submitMutation.isPending}
          loadingText={`${postId ? "Editing" : "Creating"} post...`}
        >
          {postId ? "Edit" : "Create"} Post
        </Button>
      </form>
    </Form>
  );
};
export default PostForm;