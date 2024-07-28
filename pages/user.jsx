import { useOrbis } from "@orbisclub/components";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Person from "../components/User";

export default function Create() {
  const { orbis, user, setConnectModalVis } = useOrbis();
  const [create, setCreate] = useState(false);

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">View your attestations | Network Society Hub</title>
        <meta
          property="og:title"
          content="View Attestations | Network Society Hub"
          key="og_title"
        />

        {/** Description */}
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="bg-main flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
        <div className="antialiased">
          <div className="flex min-h-screen">
            {/*  Page content */}
            <main className="grow overflow-hidden">
              {/*  Site header */}
              <Header />
              <Hero
                title="View Attestations You've Created or Recieved"
                description=""
                image
              />

              {/* Page content */}
              <section>
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <div className="md:flex md:justify-between">
                    {/* Show post editor or connect button */}
                    <div className="pb-12 pt-0 md:grow md:pr-10">
                      {user ? (
                        <>
                          <Person />
                        </>
                      ) : (
                        <div className="border-primary bg-secondary w-full rounded border bg-slate-50 p-6 text-center">
                          <p className="text-secondary mb-2 text-base">
                            You must be connected to share a post in this forum.
                          </p>
                          <button
                            className="btn-sm btn-main py-1.5"
                            onClick={() => setConnectModalVis(true)}
                          >
                            Connect
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>

        {/*  Site footer */}
        <Footer />
      </div>
    </>
  );
}
