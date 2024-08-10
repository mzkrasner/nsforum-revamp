import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

const page = () => {
  return (
    <form className="mx-auto max-w-[640px] space-y-5">
      <Textarea
        name="title"
        rows={1}
        className="font-serif text-3xl font-medium"
        autoGrow
      />
      <Textarea name="content" className="min-h-80" autoGrow />
      <Button type="submit" className="ml-auto block">
        Create Post
      </Button>
    </form>
  );
};
export default page;
