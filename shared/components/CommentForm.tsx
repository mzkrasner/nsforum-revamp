"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import useCommentForm from "../hooks/useCommentForm";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import RichTextEditor from "./RichTextEditor";
import { Button } from "./ui/button";

type Props = {
  comment?: OrbisDBRow<CommentType>;
  cancel?: () => void;
};

const CommentForm = (props?: Props) => {
  const { comment, cancel = () => null } = props || {};
  const { form, saveMutation } = useCommentForm({ comment, onSave: cancel });
  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      {/* TODO: Handle type here */}
      <form onSubmit={handleSubmit((v: any) => saveMutation.mutate(v))}>
        <FormField
          control={control}
          name="body"
          render={({ field, fieldState: { error } }) => {
            const { onChange, value, ref } = field;
            return (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    placeholder="Comment"
                    ref={ref}
                    className="min-h-40 text-sm"
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
        <div className="mt-3 flex justify-end gap-3">
          {comment && (
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={saveMutation.isPending}
            loadingText={`${comment ? "Editing" : "Creating"} comment...`}
          >
            {comment ? "Edit" : ""} Comment
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CommentForm;
