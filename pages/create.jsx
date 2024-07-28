import { useOrbis } from "@orbisclub/components";
import Head from "next/head";
import { useEffect, useState } from "react";
import AttestEditor from "../components/AttestEdit";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import NewEditor from "../components/NewEditor";
import Sidebar from "../components/Sidebar";

export default function Create() {
  const { orbis, user, setConnectModalVis } = useOrbis();
  const [create, setCreate] = useState(false);

  useEffect(() => {
    if (global.orbis_context) {
      console.log(global.orbis_context);
    }
    if (user) {
    }
  }, [user]);

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">Share a new post | Network Society Forum</title>
        <meta
          property="og:title"
          content="Share a new post | Network Society Forum"
          key="og_title"
        />

        {/** Description */}
        <meta
          name="description"
          content="Discuss the future of Network Societies"
          key="description"
        ></meta>
        <meta
          property="og:description"
          content="Discuss the future of Network Societies"
          key="og_description"
        />
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
                title="Sharing a new post on the Network Society Forum"
                description="You are about to share a new post. Make sure to read our rules before doing so."
                image
              />

              {/* Page content */}
              <section>
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <div className="md:flex md:justify-between">
                    {/* Show post editor or connect button */}
                    <div className="pb-12 pr-10 pt-0 md:grow">
                      {user ? (
                        <>
                          {create ? (
                            <>
                              <AttestEditor context={global.orbis_context} />
                              <button
                                className="btn-sm btn-secondary mt-3 py-1.5"
                                onClick={() => setCreate(false)}
                              >
                                Back
                              </button>
                            </>
                          ) : (
                            <>
                              <NewEditor />
                              {/* <div className="w-full text-center bg-slate-50 rounded border border-primary bg-stone-300	 p-6">
                              <button
                                className="btn-sm py-1.5 btn-secondary"
                                onClick={() => setCreate(true)}
                              >
                                Create an Attestation
                              </button>
                            </div> */}
                            </>
                          )}
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
                    <Sidebar />
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
