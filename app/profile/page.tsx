import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Posts from "./_components/Posts";
import ProfileInfo from "./_components/ProfileInfo";

const ProfilePage = () => {
  return (
    <div className="container mx-auto max-w-[600px] flex-1 py-10">
      <ProfileInfo />
      <section className="mt-10">
        <Tabs className="mb-5" defaultValue="drafts">
          <TabsList className="mb-3">
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          <TabsContent value="drafts">
            <Posts />
          </TabsContent>
          <TabsContent value="posts">
            <Posts />
          </TabsContent>
          <TabsContent value="comments">
            <Posts />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};
export default ProfilePage;
