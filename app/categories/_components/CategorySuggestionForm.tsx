"use client";

import { suggestCategory } from "@/shared/actions/category";
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
import {
  CategorySuggestionSchema,
  categorySuggestionSchema,
} from "@/shared/schema/categorySuggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const CategorySuggestionForm = () => {
  const router = useRouter();

  const form = useForm<CategorySuggestionSchema>({
    resolver: zodResolver(categorySuggestionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { control, handleSubmit } = form;

  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationKey: ["create-category-suggection"],
    mutationFn: suggestCategory,
    onSuccess: (res) => {
      if (!res.id) return;
      toast({
        title: "Message",
        description: "Your suggestion has been registered",
      });
      router.push("/categories");
    },
  });

  return (
    <Form {...form}>
      <form
        className="w-full space-y-5"
        onSubmit={handleSubmit((values) => submitMutation.mutate(values))}
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
          <Button
            type="submit"
            loading={submitMutation.isPending}
            loadingText={"Suggesting"}
          >
            Suggest
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CategorySuggestionForm;
