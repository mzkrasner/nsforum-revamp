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
import useAuth from "@/shared/hooks/useAuth";
import useProfile from "@/shared/hooks/useProfile";
import { ProfileFormType, profileSchema } from "@/shared/schema/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLinkAccount, usePrivy } from "@privy-io/react-auth";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ProfileForm = () => {
  const { user, authenticated, updateEmail, unlinkTwitter } = usePrivy();
  const privyEmail = user?.email?.address;
  const privyPhone = user?.phone?.number;

  const { linkPhone, linkTwitter, linkEmail } = useLinkAccount();
  const { linkedPhone, linkedTwitterAcct } = useAuth();

  const { profile, saveMutation, profileQuery } = useProfile();
  const { name = "", username = "", email = "", phone = "" } = profile || {};

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name,
      username,
      email: email || privyEmail || "",
      phone: phone || privyPhone || "",
    },
  });
  const { handleSubmit, control, watch, setValue } = form;

  useEffect(() => {
    if (!watch("email") && privyEmail) setValue("email", privyEmail);
    if (!watch("phone") && privyPhone) setValue("phone", privyPhone);
    if (!watch("name") && name) setValue("name", name);
    if (!watch("username") && username) setValue("username", username);
  }, [watch, setValue, privyEmail, privyPhone, name, username]);

  if (!authenticated) return;

  if (profileQuery.isLoading) return "Loading...";

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
                  {/* <div className="flex items-center gap-3"> */}
                  <Input {...field} error={error} />
                  {/* <Button
                      variant="outline"
                      className="ml-auto flex w-fit gap-1 px-2 text-sm"
                    >
                      <LockOpenIcon size={16} /> Lock
                    </Button>
                  </div> */}
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
                  <div className="flex items-center gap-3">
                    <Input
                      type="email"
                      {...field}
                      className="border-none focus-visible:ring-0"
                      error={error}
                      readOnly={!!field.value}
                    />
                    {!field.value ? (
                      <Button
                        variant="outline"
                        className="ml-auto flex w-fit gap-1 px-2 text-sm"
                        onClick={linkEmail}
                      >
                        <PlusIcon size={16} /> Add
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="ml-auto flex w-fit gap-1 px-2 text-sm"
                        onClick={() => updateEmail()}
                      >
                        Change
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormItem>
          <FormLabel>Phone number</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              <Input
                placeholder="No phone number added"
                value={linkedPhone?.number || ""}
                className="border-0 focus-visible:ring-0"
                readOnly
              />
              <Button
                variant="outline"
                className="ml-auto flex w-fit gap-1 px-2 text-sm"
                onClick={linkPhone}
              >
                <PlusIcon size={16} /> Add
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>X account</FormLabel>
          <FormControl>
            <div className="flex items-center gap-3">
              <Input
                placeholder="No account added"
                value={linkedTwitterAcct?.username || ""}
                className="border-0 focus-visible:ring-0"
                readOnly
              />
              {linkedTwitterAcct ? (
                <Button
                  variant="outline"
                  className="ml-auto flex w-fit gap-1 px-2 text-sm"
                  onClick={() => unlinkTwitter(linkedTwitterAcct.subject)}
                >
                  <XIcon size={16} /> Remove
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="ml-auto flex w-fit gap-1 px-2 text-sm"
                  onClick={linkTwitter}
                >
                  <PlusIcon size={16} /> Add
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
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
