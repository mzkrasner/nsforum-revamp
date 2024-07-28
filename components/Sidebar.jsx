import { useOrbis } from "@orbisclub/components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ReactTimeAgo from "react-time-ago";
import usePosts from "../hooks/usePosts";
import { LoadingCircle } from "./Icons";

function Sidebar() {
  return (
    <aside className="border-primary sticky left-0 top-0 min-h-screen overflow-y-auto border-l-0 pb-12 pt-6 scrollbar-hide md:w-64 md:shrink-0 md:border-l md:pb-20">
      <div className="md:pl-5 lg:pl-10">
        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Newsletter: Coming soon
          <NewsletterBlock />
           */}

          {/* New Discussions */}
          <RecentDiscussions />

          {/* Active topics: Coming soon
            <Categories />
          */}
        </div>
      </div>
    </aside>
  );
}

/** Show recent discussions */
const RecentDiscussions = () => {
  // const { orbis, user } = useOrbis();
  // const [loading, setLoading] = useState(false);
  // const [posts, setPosts] = useState([]);

  const {
    posts = [],
    loading,
    fetching,
    fetchNextPage,
    hasNextPage,
  } = usePosts();

  const {
    ref: anchorRef,
    inView,
    entry,
  } = useInView({
    /* Optional options */
    threshold: 0,
    rootMargin: "0px 0px 800px 0px", // trigger refetch when the bottom is 800px away
  });

  useEffect(() => {
    if (!inView || !hasNextPage) return;
    fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage]);

  /** Load all of the categories (sub-contexts) available in this forum */
  // useEffect(() => {
  //   loadPosts(global.orbis_context, true);
  //   async function loadPosts(context, include_child_contexts) {
  //     setLoading(true);
  //     let { data, error } = await orbis.getPosts(
  //       {
  //         context: context,
  //         only_master: true,
  //         include_child_contexts: include_child_contexts,
  //         order_by: 'last_reply_timestamp',
  //       },
  //       0,
  //       5
  //     );
  //     setLoading(false);

  //     if (error) {
  //       console.log('error:', error);
  //     }
  //     if (data) {
  //       setPosts(data);
  //     }
  //   }
  // }, []);

  if (loading)
    return (
      <div className="text-primary flex min-h-screen w-full items-center justify-center">
        <LoadingCircle />
      </div>
    );

  return (
    <div>
      <div className="text-tertiary mb-4 text-xs font-semibold uppercase">
        Voting
      </div>
      <h3 className="mb-1 text-sm">
        <Link
          className="text-primary font-semibold hover:underline"
          href="/proposals"
        >
          Proposals
        </Link>
      </h3>

      <div className="mt-4" />
      <div className="text-tertiary mb-4 text-xs font-semibold uppercase">
        Active Discussions
      </div>
      <ul className="space-y-6">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, key) => {
              return (
                <li key={key}>
                  <h3 className="mb-1 text-sm">
                    <Link
                      className="text-primary font-semibold hover:underline"
                      href={"/post/" + post.stream_id}
                    >
                      {post.content.title}
                    </Link>
                  </h3>
                  <div className="text-secondary flex flex-row items-center space-x-1 text-xs">
                    <span className="text-tertiary">Last activity</span>{" "}
                    <span>
                      <ReactTimeAgo
                        date={
                          post.last_reply_timestamp
                            ? post.last_reply_timestamp * 1000
                            : post.timestamp * 1000
                        }
                        locale="en-US"
                      />
                    </span>
                  </div>
                </li>
              );
            })}
          </>
        ) : (
          <div className="border-primary bg-secondary w-full rounded border bg-white/10 p-6 text-center">
            <p className="text-secondary text-sm">
              There isn&apos;t any posts here yet.
            </p>
          </div>
        )}
      </ul>
      {/* An anchor element to monitor when to fetch more posts */}
      <div ref={anchorRef}></div>
      {fetching && (
        <div className="text-primary flex w-full justify-center p-3">
          <LoadingCircle />
        </div>
      )}
    </div>
  );
};

/** Will loop through all categories and display them */
const Categories = () => {
  const { orbis, user } = useOrbis();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  /** Load all of the categories (sub-contexts) available in this forum */
  useEffect(() => {
    loadContexts();
    async function loadContexts() {
      setLoading(true);
      let { data, error } = await orbis.api
        .from("orbis_contexts")
        .select()
        .eq("context", global.orbis_context)
        .order("created_at", { ascending: false });
      setCategories(data);
      setLoading(false);
    }
  }, [orbis.api]);

  return (
    <div>
      <div className="mb-4 mt-3 text-xs font-semibold uppercase text-slate-600">
        Active Categories
      </div>
      {loading ? (
        <div className="flex w-full justify-center p-3 text-gray-900">
          <LoadingCircle />
        </div>
      ) : (
        <ul className="space-y-3">
          {categories && categories.length > 0 ? (
            <>
              {categories.map((category, key) => {
                return (
                  <li className="flex flex-row" key={key}>
                    <div
                      style={{
                        background: "#E9993E",
                        width: 4,
                        marginRight: 10,
                      }}
                    ></div>
                    <div className="flex w-full flex-1 flex-wrap items-center justify-between">
                      <div className="mr-2 flex items-center">
                        <Link
                          className="text-primary truncate text-sm font-semibold hover:underline"
                          href="#0"
                        >
                          {category.content.displayName}
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </>
          ) : (
            <div className="w-full rounded border border-slate-200 bg-[#F9FAFB] p-6 text-center">
              <p className="text-secondary text-sm">
                There isn&apos;t any category in this forum.
              </p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

const NewsletterBlock = () => {
  return (
    <div>
      <div className="border-brand relative border bg-white p-5">
        <div
          className="pointer-events-none absolute inset-0 -z-10 -m-px before:absolute before:inset-0 before:bg-gradient-to-t before:from-slate-700 before:to-slate-800 after:absolute after:inset-0 after:m-px after:bg-slate-900"
          aria-hidden="true"
        />
        <div className="text-brand mb-3 text-center font-semibold">
          Receive our forum updates by email:
        </div>
        {/* Form */}
        <div className="w-full">
          <label className="sr-only block text-sm" htmlFor="newsletter">
            Email
          </label>
          <form className="relative mx-auto flex max-w-xs items-center">
            <input
              id="newsletter"
              type="email"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-900 placeholder:text-slate-500"
              placeholder="Your email"
            />
            <button
              type="submit"
              className="absolute inset-0 left-auto"
              aria-label="Subscribe"
            >
              <svg
                className="text-brand mx-3 h-3 w-3 shrink-0 fill-current"
                viewBox="0 0 12 12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                  fillRule="nonzero"
                />
              </svg>
            </button>
          </form>
          <p className="text-secondary mt-1 w-full text-center text-xs">
            Your email will be encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
