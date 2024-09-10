"use client";

import { FormEvent } from "react";
import useTagForm from "../hooks/useTagForm";
import { OrbisDBRow } from "../types";
import { Tag } from "../types/tag";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = { tag?: OrbisDBRow<Tag>; onSave?: (tag: OrbisDBRow<Tag>) => void };
const TagForm = ({ tag, onSave }: Props) => {
  const { form, saveMutation } = useTagForm({ tag, onSave });
  const { handleSubmit, control } = form;
  const errorMessage = saveMutation.error?.message;

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.stopPropagation();
          handleSubmit((values) => saveMutation.mutate(values))(e);
        }}
      >
        <FormField
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Name" error={error} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Description"
                    rows={1}
                    error={error}
                    autoGrow
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {errorMessage && (
          <div className="my-2 text-center text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            loading={saveMutation.isPending}
            loadingText="Creating Tag..."
          >
            Create Tag
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default TagForm;
