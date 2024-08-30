"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import useCommentForm from "../hooks/useCommentForm";
import { FetchCommentsArg } from "../orbis/queries";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import RichTextEditor from "./RichTextEditor";
import { Button } from "./ui/button";

type Props = {
  comment?: OrbisDBRow<CommentType>;
  cancel?: () => void;
  parentIds?: string[];
  isReply?: boolean;
  fetchCommentsArg: FetchCommentsArg;
};

const CommentForm = (props: Props) => {
  const {
    comment,
    cancel = () => null,
    parentIds = [],
    fetchCommentsArg,
  } = props || {};
  const { form, saveMutation } = useCommentForm({
    comment,
    onSave: cancel,
    parentIds,
    fetchCommentsArg,
  });
  const { handleSubmit, control } = form;

  const isReply = !!parentIds;

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
                    placeholder={isReply ? "Reply" : "Comment"}
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
          {(comment || parentIds) && (
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={saveMutation.isPending}
            loadingText={`${comment ? "Editing" : "Creating"} ${isReply ? "reply" : "comment"}...`}
          >
            {comment ? "Edit" : ""} {isReply ? "Reply" : "Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CommentForm;
