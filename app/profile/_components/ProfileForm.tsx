"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import useProfile from "@/shared/hooks/useProfile";
import { ProfileFormType, profileSchema } from "@/shared/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ProfileForm = () => {
  const { profile, saveMutation } = useProfile();
  const { name = "", username = "", email = "" } = profile || {};

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      username,
      email,
    },
  });
  const { handleSubmit, control } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((v) => saveMutation.mutate(v))}
        className="mx-auto flex w-full flex-col gap-3"
      >
        <FormField
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} error={error} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="username"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3">
                    <Input {...field} error={error} />
                    <Button
                      variant="outline"
                      className="ml-auto flex w-fit px-2 text-sm"
                    >
                      Verify
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="email"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} error={error} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          className="ml-auto mt-3 flex"
          loading={saveMutation.isPending}
          loadingText="Saving..."
        >
          Save
        </Button>
      </form>
    </Form>
  );
};
export default ProfileForm;
