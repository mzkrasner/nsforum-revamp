import AuthGuard from "@/shared/components/AuthGuard";
import NoProfileGuard from "@/shared/components/NoProfileGuard";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Comments from "./_components/Comments";
import Drafts from "./_components/Drafts";
import Posts from "./_components/Posts";
import ProfileInfo from "./_components/ProfileInfo";

const ProfilePage = () => {
  return (
    <AuthGuard message="Sign in to view your profile.">
      <NoProfileGuard>
        <div className="pt-10">
          <ProfileInfo />
          <section className="mt-10">
            <Tabs className="mb-5" defaultValue="drafts">
              <TabsList className="mx-auto mb-3 flex w-fit sm:mx-0">
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="drafts">
                <Drafts />
              </TabsContent>
              <TabsContent value="posts">
                <Posts />
              </TabsContent>
              <TabsContent value="comments">
                <Comments />
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </NoProfileGuard>
    </AuthGuard>
  );
};
export default ProfilePage;
