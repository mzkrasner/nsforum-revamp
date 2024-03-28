import React, { useRef } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import ArticleContent from '../../components/ArticleContent';
import ArticleTableOfContent from '../../components/ArticleTableOfContent';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

import loadSinglePost from '../../controllers/loadSinglePost';
import useSinglePost from '../../hooks/useSinglePost';
import loadPosts from '../../controllers/loadPosts';
import { LoadingCircle } from '../../components/Icons';

export default function Post({ postId, post: initialData }) {
  const isServer = typeof window === 'undefined';
  const articleRef = useRef();

  const singlePost = useSinglePost({ postId, initialData });
  let post = singlePost.post;
  if (isServer || !post) {
    post = initialData;
  }

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">{post?.content?.title}</title>
        <meta property="og:title" content={post?.content?.title} key="og_title" />

        {/** Description */}
        <meta name="description" content={post?.content?.data?.abstract} key="description"></meta>
        <meta property="og:description" content={post?.content?.data?.abstract} key="og_description" />
        <link rel="icon" href="/favicon.png" />

        {post?.content?.media && post?.content?.media.length > 0 &&
          <>
            {/**<meta property="og:image" content={"https://orbis.club/api/og-ipfs-image?hash=" + encodeURIComponent(seo.title_og_image)} />*/}
            <meta property="og:image" content={post?.content.media[0].url.replace("ipfs://", post?.content.media[0].gateway) + "?format=share-img"} />
            <meta name="twitter:card" content="summary_large_image" />
          </>
        }
      </Head>
      <div className="antialiased flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip bg-main">
        <Header />
        <main
          className="grow"
        >
          <section>
            <div className="flex max-w-6xl mx-auto px-4 sm:px-6 pt-6">
              <div className="relative md:flex md:gap-6 md:justify-between w-full">
                {(!post || singlePost.loading) ? (
                  <div className='flex w-full justify-center my-auto text-primary'>
                    <LoadingCircle />
                  </div>
                ) : (
                  <>
                    {/* Page content*/}
                    <ArticleTableOfContent post={post} ref={articleRef} />
                    <ArticleContent post={post} ref={articleRef} />
                  </>
                )}
                <Sidebar />
              </div>
            </div>
          </section>
        </main>
        {/* Site footer*/}
        <Footer />
      </div>
    </>
  );
}

/** Load content for Blog */
// Post.getInitialProps = async (context) => {
//   const post = await loadSinglePost(context.query.post_id)
//   /** Return results */
//   return {
//     post_id: context.query.post_id,
//     post: post ? post : null
//   };
// }

export async function getStaticPaths() {
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const posts = await loadPosts(process.env.ORBCONTEXT, false, 0) || [];
  const paths = posts.map((post) => ({
    params: { post_id: post.stream_id },
  }))

  // { fallback: false } means other routes should 404
  return { paths, fallback: true }
}

// This function gets called at build time
export async function getStaticProps(context) {
  const postId = context.params.post_id;

  // const queryClient = new QueryClient();

  const getPost = async () => {
    const post = await loadSinglePost(postId);
    return post || null;
  };
  const post = await getPost();

  // await queryClient.prefetchQuery({
  //   queryKey: ['post', { postId }],
  //   queryFn: getPost,
  // });

  return {
    props: {
      postId,
      post: JSON.parse(JSON.stringify(post))
    },
  };
}
