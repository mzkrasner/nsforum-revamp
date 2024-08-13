import { fetchPosts } from "./_actions/post";
import Header from "./_components/Header";
import PostList from "./_components/PostList";

const HomePage = async () => {
  const posts = await fetchPosts();
  console.log(posts);
  return (
    <main>
      <Header />
      <div className="md:grid md:grid-cols-[1fr_320px]">
        <PostList posts={posts || []} />
      </div>
    </main>
  );
};

export default HomePage;
