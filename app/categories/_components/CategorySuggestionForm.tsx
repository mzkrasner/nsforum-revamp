"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { useToast } from "@/shared/components/ui/hooks/use-toast";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ToastAction } from "@/shared/components/ui/toast";
import {
  CategorySuggestionSchema,
  categorySuggestionSchema,
} from "@/shared/schema/categorySuggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { onSuggestCategory } from "../actions";

const CategorySuggestionForm = () => {
  const [state, formAction] = useFormState(onSuggestCategory, {
    message: "",
  });
  const { pending } = useFormStatus();

  const router = useRouter();

  const ref = useRef<HTMLFormElement>(null);

  const form = useForm<CategorySuggestionSchema>({
    resolver: zodResolver(categorySuggestionSchema),
    defaultValues: {
      name: "",
      description: "",
      ...(state?.fields ?? {}),
    },
  });
  const { control, handleSubmit } = form;

  const { toast } = useToast();

  useEffect(() => {
    const { message } = state;
    if (!message) return;

    toast({
      title: "Message",
      description: message,
      action: (
        <ToastAction
          altText="Go back"
          onClick={() => router.push("/categories")}
        >
          Back
        </ToastAction>
      ),
    });
  }, [toast, state, router]);

  return (
    <Form {...form}>
      <form
        ref={ref}
        className="w-full space-y-5"
        action={formAction}
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit(() => {
            formAction(new FormData(ref.current!));
          })(evt);
        }}
      >
        <FormField
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Category name" error={error} />
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
                    placeholder="Category description"
                    rows={1}
                    className="min-h-12"
                    error={error}
                    autoGrow
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex justify-end gap-3">
          <Button type="submit" loading={pending} loadingText={"Suggesting"}>
            Suggest
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CategorySuggestionForm;
