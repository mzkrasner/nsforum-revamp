"use client";

import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import useOrbis from "@/shared/hooks/useOrbis";
import { catchError } from "@/shared/lib/orbis/utils";
import { useForm } from "react-hook-form";

const page = () => {
  const { handleSubmit, register } = useForm();
  const orbis = useOrbis();

  const submit = async (values: any) => {
    if (!orbis) return;
    // kjzl6hvfrbw6cavxnkej30g3lroka708z25pfud1ei93x5rgc00hif4s7x1he18
    const insertStatement = orbis.insert("post").value(values);
    const [result, error] = await catchError(() => insertStatement.run());
    console.log(result, error, typeof error);
  };

  return (
    <form
      className="mx-auto max-w-[640px] space-y-5"
      onSubmit={handleSubmit(submit)}
    >
      <Textarea
        {...register("title")}
        name="title"
        rows={1}
        className="min-h-12 font-serif text-3xl font-medium"
        autoGrow
      />
      <Textarea
        {...register("content")}
        name="content"
        className="min-h-80"
        autoGrow
      />
      <Button type="submit" className="ml-auto block">
        Create Post
      </Button>
    </form>
  );
};
export default page;
