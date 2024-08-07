import Header from "./components/Header";
import PostList from "./components/PostList";

export default function HomePage() {
  return (
    <main className="">
      <Header />
      <div className="md:grid md:grid-cols-[1fr_320px]">
        <PostList />
        <div></div>
      </div>
    </main>
  );
}
