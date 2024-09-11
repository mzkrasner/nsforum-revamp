"use client";

import CategorySelector from "@/shared/components/CategorySelector";
import NoProfileGuard from "@/shared/components/NoProfileGuard";
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
import useProfile from "@/shared/hooks/useProfile";
import { uploadToPinata } from "@/shared/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import usePost from "../../_hooks/usePost";
import TagsSelector from "./components/TagsSelector";
import usePostForm from "./usePostForm";

type Props = { isEditing?: boolean };
const PostForm = ({ isEditing }: Props) => {
  const { profile, profileQuery } = useProfile();
  const { authenticated, ready } = usePrivy();
  const { postQuery } = usePost();
  const { form, categories, publishMutation, draftMutation } = usePostForm({
    isEditing,
  });
  const { handleSubmit, control, setValue } = form;

  if (!authenticated)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
        <h3 className="font-medium">Sign in to create or edit posts</h3>
        {ready && <SignInButton variant="outline" className="mx-auto block" />}
      </div>
    );

  if (postQuery.isLoading) return "Loading...";

  if (!profile)
    return (
      <NoProfileGuard displayMessage="You must add a profile before you create posts" />
    );

  if (!profile && profileQuery.isSuccess) return <NoProfileGuard />;

  return (
    <Form {...form}>
      <form
        className="mx-auto w-full max-w-[640px] space-y-5"
        onSubmit={handleSubmit((v: any) => publishMutation.mutate(v))} // TODO: Fix type error
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
                    uploadImage={uploadToPinata}
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
            const selectedCategory = categories.find(
              ({ stream_id }) => stream_id === value,
            );
            return (
              <FormItem>
                <FormControl>
                  <CategorySelector
                    ref={ref}
                    label="Select category"
                    selectedCategory={selectedCategory}
                    onSelect={({ stream_id }) => onChange(stream_id)}
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
          name="tag_ids"
          render={({ field, fieldState: { error } }) => {
            const { value = [], onChange } = field;
            return (
              <FormItem>
                <FormControl>
                  <TagsSelector
                    selectedTagIds={value}
                    onChange={(tagIds: string[]) => {
                      onChange(tagIds);
                    }}
                    error={error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleSubmit((v: any) => draftMutation.mutate(v))}
            loading={draftMutation.isPending}
            loadingText={`${isEditing ? "Saving as" : "Converting to"} draft...`}
          >
            {isEditing ? "Convert to" : "Save as"} Draft
          </Button>
          <Button
            type="submit"
            loading={publishMutation.isPending}
            loadingText={`${isEditing ? "Editing" : "Creating"} post...`}
          >
            {isEditing ? "Edit" : "Create"} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default PostForm;
