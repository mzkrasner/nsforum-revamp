"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { CategorySchema, categorySchema } from "@/shared/schema/category";
import { OrbisDBRow } from "@/shared/types";
import { Category } from "@/shared/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useCategory from "../_hooks/useCategory";
import { createCategory, editCategory } from "../actions";

type Props = { id?: string };
const CategoryForm = ({ id }: Props = {}) => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { control, handleSubmit, setValue } = form;

  const { categoryQuery } = useCategory({
    id,
  });

  useEffect(() => {
    const category = categoryQuery.data;
    if (!category) return;
    setValue("name", category.name);
    setValue("description", category.description);
  }, [setValue, categoryQuery.data]);

  const categoryMutation = useMutation({
    mutationKey: ["create-category"],
    mutationFn: async (values: CategorySchema) => {
      if (id) {
        return await editCategory({ ...values, stream_id: id });
      }
      return await createCategory(values);
    },
    onSuccess: (response) => {
      if (!response?.id) return;
      // Update category list queries
      queryClient.setQueriesData(
        {
          queryKey: ["categories"],
        },
        produce((categories?: InfiniteData<OrbisDBRow<Category>[]>) => {
          if (!categories) return;
          const { pages } = categories;
          outerLoop: for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            for (let j = 0; j < page.length; j++) {
              const category = page[j];
              if (category.stream_id === id) {
                Object.assign(category, response.content);
                break outerLoop;
              }
            }
          }
        }),
      );

      // Update category query
      queryClient.setQueryData(
        ["category", { id }],
        produce((staleData: OrbisDBRow<Category>) => {
          if (staleData && staleData.stream_id === response.id)
            Object.assign(staleData, response.content);
        }),
      );
      router.push("/admin/categories");
    },
  });
  console.log(categoryMutation.error);

  if (categoryQuery.isLoading) return "Loading...";

  return (
    <Form {...form}>
      <form
        className="w-full space-y-5"
        onSubmit={handleSubmit((values) => categoryMutation.mutate(values))}
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
            loading={categoryMutation.isPending}
            loadingText={`${id ? "Updating" : "Creating"} Category`}
          >
            {id ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CategoryForm;
