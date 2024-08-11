import Header from "./_components/Header";
import PostList from "./_components/PostList";

export default function HomePage() {
  return (
    <main className="">
      <Header />
      <div className="md:grid md:grid-cols-[1fr_320px]">
        <PostList />
      </div>
    </main>
  );
}
