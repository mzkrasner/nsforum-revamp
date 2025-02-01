"use client";

import { uploadToPinata } from "@/shared/actions/pinata";
import CategorySelector from "@/shared/components/CategorySelector";
import NoProfileGuard from "@/shared/components/NoProfileGuard";
import RichTextEditor from "@/shared/components/RichTextEditor";
import { checkAddressLockThreshold } from "@/shared/components/SciLockThresholdCheck";
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
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import usePost from "../../_hooks/usePost";
import TagsSelector from "./components/TagsSelector";
import usePostForm from "./usePostForm";

type Props = { isEditing?: boolean };
const PostForm = ({ isEditing }: Props) => {
  const { isConnected, address } = useAccount();
  const { postQuery } = usePost();
  const { form, categories, publishMutation, draftMutation } = usePostForm({
    isEditing,
  });
  const { handleSubmit, control, setValue } = form;
  const [lockedSci, setLockedSci] = useState<boolean | null>(null);

  useEffect(() => {
    if (address && address.length && isConnected) {
      let lockedSci = false;

      checkAddressLockThreshold(address).then((result) => {
        if (result) {
          lockedSci = true;
          setLockedSci(true);
          return;
        }
      });
    }
  }, [address, isConnected]);

  if (!isConnected)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
        <h3 className="font-medium">Sign in to create or edit posts</h3>
        <SignInButton variant="outline" className="mx-auto" />
      </div>
    );

  if (!lockedSci && isConnected) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-5">
        <h3 className="font-medium">
          You must have greater than 5000 locked SCI to create or edit posts
        </h3>
      </div>
    );
  }

  if (postQuery.isLoading) return "Loading...";

  return (
    <NoProfileGuard message="You must add a profile before you create posts">
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
              loadingText={`${isEditing ? "Updating" : "Creating"} proposal...`}
            >
              {isEditing ? "Update" : "Create"} Proposal
            </Button>
          </div>
        </form>
      </Form>
    </NoProfileGuard>
  );
};
export default PostForm;
