import { Web3Provider } from "@ethersproject/providers";
import { useOrbis } from "@orbisclub/components";
import snapshot from "@snapshot-labs/snapshot.js";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Model } from "survey-core";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Sidebar from "../components/Sidebar";
import { getActiveProposals, getSingleProposal } from "../utils/snapshot";

const surveyJson = {
  elements: [
    {
      name: "title",
      title: "Title:",
      type: "text",
    },
    {
      name: "body",
      title: "Body:",
      type: "text",
    },
    {
      name: "choices",
      title: "Choices (comma-separated):",
      type: "text",
    },
  ],
};

export default function Create() {
  const { orbis, user, setConnectModalVis } = useOrbis();
  const [create, setCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState(0);
  const [surv, setSurv] = useState();
  const [choices, setChoices] = useState([]);
  const [choice, setChoice] = useState("");
  const [reason, setReason] = useState("");
  const [toolbarStyle, setToolbarStyle] = useState({});
  const [type, setType] = useState("single-choice");
  const [voting, setVoting] = useState(false);
  const [proposal, setProposal] = useState({});
  const [proposals, setProposals] = useState([]);
  const [vote, setVote] = useState("");
  const textareaRef = useRef();
  const survey = new Model(surveyJson);
  survey.onComplete.add(onCompleteProposal);

  async function onCompleteProposal(survey) {
    try {
      const values = survey.data;
      const { title, body, choices } = values;

      // TODO: Validate title, body, and choices. For example, make sure they aren't empty.

      // Using selectedEthereumProvider on window is a hack so that we can
      // access the provider that was selected elsewhere in the app. For some
      // reason, orbis doesn't seem to expose the provider on the orbis object.
      const provider = window.selectedEthereumProvider ?? window.ethereum;

      const web3 = new Web3Provider(provider);
      const [account] = await web3.listAccounts();

      const hub = "https://hub.snapshot.org"; // or https://testnet.hub.snapshot.org for testnet
      const client = new snapshot.Client712(hub);

      // TODO: Likely, these values will come from user input
      const type = "single-choice";
      // const title = 'Test proposal using Snapshot.js';
      // const body = 'This is the content of the proposal';
      // const choices = ['Alice', 'Bob', 'Carol'];
      const start = Math.floor(Date.now() / 1000); // Start now
      const end = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // End 5 days from now
      const blockNumberSnapshot = 13620822;

      const receipt = await client.proposal(web3, account, {
        space: "test space", // TODO: Replace with your space name
        type,
        title,
        body,
        choices,
        start,
        end,
        snapshot: blockNumberSnapshot,
        network: "1",
        plugins: JSON.stringify({}),
        app: "my-app", // TODO: Replace with the name of your project which is using this snapshot.js integration
      });

      console.log("receipt", receipt);

      alert("Proposal created! Check the console for the receipt.");
    } catch (err) {
      // Temporary error handling
      console.error(err);
      alert("Error creating proposal. Check the console for details.");
    }
  }

  const completeProposal = async () => {
    try {
      const provider = window.selectedEthereumProvider ?? window.ethereum;
      const web3 = new Web3Provider(provider);
      const [account] = await web3.listAccounts();

      const hub = "https://hub.snapshot.org"; // or https://testnet.hub.snapshot.org for testnet
      const client = new snapshot.Client712(hub);
      const start = Math.floor(Date.now() / 1000); // Start now
      const end = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5; // End 5 days from now
      const blockNumberSnapshot = 13620822;
      const prop = {
        space: "verifiedtalent.eth", // TODO: Replace with your space name
        type,
        title,
        body,
        choices,
        start,
        end,
        snapshot: blockNumberSnapshot,
        network: "1",
        plugins: JSON.stringify({}),
        app: "my-app", // TODO: Replace with the name of your project which is using this snapshot.js integration
      };
      console.log("prop", prop);

      const receipt = await client.proposal(web3, account, {
        space: "verifiedtalent.eth", // TODO: Replace with your space name
        type,
        title,
        body,
        choices,
        start,
        end,
        snapshot: blockNumberSnapshot,
        network: "1",
        plugins: JSON.stringify({}),
        app: "my-app", // TODO: Replace with the name of your project which is using this snapshot.js integration
      });

      console.log("receipt", receipt);
      if (receipt.id) {
        setTitle("");
        setBody("");
        setChoices([]);
        setChoice("");
        setType("single-choice");
      }
      setCreate(false);
    } catch (err) {
      // Temporary error handling
      console.error(err);
      alert("Error creating proposal. Check the console for details.");
      setCreate(false);
    }
  };

  const completeVote = async (proposal) => {
    if (!reason) {
      alert("Please provide a reason for your vote.");
      return;
    }
    try {
      const provider = window.selectedEthereumProvider ?? window.ethereum;
      const web3 = new Web3Provider(provider);
      const [account] = await web3.listAccounts();

      const hub = "https://hub.snapshot.org"; // or https://testnet.hub.snapshot.org for testnet
      const client = new snapshot.Client712(hub);

      const prop = {
        space: "verifiedtalent.eth",
        proposal,
        type: "single-choice",
        choice: 1,
        reason,
        app: "my-app",
      };
      console.log("prop", prop);

      const receipt = await client.vote(web3, account, prop);

      console.log("receipt", receipt);
      if (receipt.id) {
        alert("Vote submitted!");
        setTitle("");
        setBody("");
        setChoices([]);
        setChoice("");
        setReason("");
        setType("single-choice");
        setVoting(false);
      }
    } catch (err) {
      // Temporary error handling
      console.error(err);
      alert("Error creating proposal. Check the console for details.");
    }
  };

  const getProposal = async (id) => {
    setVoting(true);
    const prop = await getSingleProposal(id);
    const arr = prop.proposal.choices;
    const choices = arr.map((choice) => {
      return { value: choice, text: choice };
    });
    console.log("choices", choices);
    const json = {
      showCompletedPage: "false",
      showQuestionNumbers: false,
      focusFirstQuestionAutomatic: false,
      completeText: "Submit",
      title: "Snapshot Voting",
      description: prop.proposal.body,
      elements: [
        {
          type: "radiogroup",
          isRequired: true,
          name: "feature",
          title: prop.proposal.title,
          showOtherItem: false,
          choices,
        },
      ],
    };
    const survey = new Model(json);
    // survey.onComplete.add(onCompleteProposal);
    setSurv(survey);

    const provider = window.selectedEthereumProvider ?? window.ethereum;
    const web3 = new Web3Provider(provider);
    const ens = await web3.lookupAddress(prop.proposal.author);
    console.log("ens", ens);
    if (ens !== null) {
      prop.proposal.author = ens;
    }
    console.log("prop", prop.proposal);
    setProposal({ ...prop.proposal });
    console.log("proposal", proposal);
  };

  useEffect(() => {
    if (global.orbis_context) {
      console.log(global.orbis_context);
    }
    if (user) {
    }
    getActiveProposals()
      .then((data) => {
        if (data?.proposals) {
          setProposals(data.proposals);
        } else {
          console.error("No proposals found");
        }
      })
      .catch(console.error);
  }, [user]);

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">Create a New Proposal | Network Society Hub</title>
        <meta
          property="og:title"
          content="Create a New Proposal | Network Society Hub"
          key="og_title"
        />

        {/** Description */}
        <meta
          name="description"
          content="Create a New Proposal"
          key="description"
        ></meta>
        <meta
          property="og:description"
          content="Create a New Proposal"
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
                title="Create a New Proposal on the Network Society Hub"
                description="You are about to share a new proposal. Make sure to read our rules before doing so."
                image
              />

              {/* Page content */}
              <section>
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <div className="md:flex md:justify-between">
                    {/* Show post editor or connect button */}
                    <div className="pb-12 pt-0 md:grow md:pr-10">
                      {user && !voting ? (
                        <>
                          {create ? (
                            <>
                              <>
                                {/** Title */}
                                <TextareaAutosize
                                  className="h-full w-full resize-none rounded-md border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Type your proposal title here"
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />

                                {/** Formatting toolbar container */}
                                <div
                                  className="z-10 -mb-px mt-4 flex items-center space-x-2 rounded-t-md border border-gray-300 bg-gray-50 p-1"
                                  style={toolbarStyle}
                                ></div>

                                {/** Actual content of the blog post */}
                                <TextareaAutosize
                                  ref={textareaRef}
                                  className="min-height-200 h-full w-full resize-none rounded-b-md border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Write your proposal content here..."
                                  value={body}
                                  onChange={(e) => setBody(e.target.value)}
                                />
                                <div>Select Voting Type</div>
                                <form className="m-3 px-4 py-3">
                                  <select
                                    className="text-center text-black"
                                    onChange={(e) => setType(e.target.value)}
                                    value={type}
                                  >
                                    <option value="single-choice">
                                      Single Choice
                                    </option>
                                  </select>
                                </form>
                                {type !== "basic" && (
                                  <TextareaAutosize
                                    ref={textareaRef}
                                    className="min-height-100 h-full w-full resize-none rounded-b-md border border-gray-300 p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter comma-separated choices here..."
                                    value={choice}
                                    onChange={(e) => {
                                      if (e.target.value.includes(",")) {
                                        setChoices([
                                          ...choices,
                                          e.target.value.slice(
                                            0,
                                            e.target.value.indexOf(","),
                                          ),
                                        ]);
                                        setChoice("");
                                      } else {
                                        setChoice(e.target.value);
                                      }
                                    }}
                                  />
                                )}
                                <div className="flex flex-row space-x-2">
                                  {choices.map((choice, index) => (
                                    <div key={index}>{choice}</div>
                                  ))}
                                </div>
                                <button
                                  className="btn-sm btn-main mr-2 py-1.5"
                                  onClick={() => completeProposal()}
                                >
                                  Create Proposal
                                </button>

                                {status == 1 && (
                                  <button className="btn-sm bg-brand bg-brand-hover mt-2 w-full">
                                    Loading...
                                  </button>
                                )}

                                {/** success status */}
                                {status == 2 && (
                                  <button className="btn-sm mt-2 w-full bg-green-500 text-slate-100">
                                    Success
                                  </button>
                                )}
                              </>
                              <button
                                className="btn-sm btn-secondary mt-3 py-1.5"
                                onClick={() => setCreate(false)}
                              >
                                Back
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn-sm btn-main py-1.5"
                                onClick={() => setCreate(true)}
                              >
                                Create a Proposal
                              </button>
                            </>
                          )}
                        </>
                      ) : user && voting ? (
                        <>
                          <div className="">
                            <h2 className="text-1xl text-secondary mb-2">
                              Proposal Title: <br />
                              <span className="text-2xl">{proposal.title}</span>
                            </h2>
                            <p className="text-secondary mb-2 text-base">
                              Created By: <br />
                              <span className="text-xl">{proposal.author}</span>
                            </p>
                            <p className="text-secondary mb-2 text-base">
                              Description: <br />
                              <span className="">{proposal.body}</span>
                            </p>

                            {proposal.choices &&
                              proposal.choices.length > 0 && (
                                <div className="flex flex-col">
                                  <h3 className="text-secondary text-lg">
                                    Choices
                                  </h3>

                                  <select
                                    className="mb-2 mt-2 w-1/2 rounded-md border border-gray-300 text-center text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setVote(e.target.value)}
                                  >
                                    {proposal.choices.map((choice, index) => (
                                      <option key={index} value={choice}>
                                        {choice}
                                      </option>
                                    ))}
                                  </select>

                                  <TextareaAutosize
                                    className="h-full w-full resize-none rounded-md border border-gray-300 p-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Reason for your choice"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                  />
                                </div>
                              )}
                            {/* {surv && <Survey model={surv} className='sa-poll-table'/>} */}
                          </div>
                          <button
                            className="btn-sm btn-main mr-2 mt-2 py-1.5"
                            onClick={() => {
                              completeVote(proposal.id);
                            }}
                          >
                            Vote
                          </button>
                          <button
                            className="btn-sm btn-secondary mt-2 py-1.5"
                            onClick={() => setVoting(false)}
                          >
                            Back
                          </button>
                        </>
                      ) : (
                        <div className="border-primary bg-secondary w-full rounded border bg-slate-50 p-6 text-center">
                          <p className="text-secondary mb-2 text-base">
                            You must be connected to share a proposal in this
                            forum.
                          </p>
                          <button
                            className="btn-sm btn-main py-1.5"
                            onClick={() => setConnectModalVis(true)}
                          >
                            Connect
                          </button>
                        </div>
                      )}

                      {!voting &&
                        proposals.map((proposal) => (
                          <div className="mt-8 text-white" key={proposal.id}>
                            <div className="flex items-center justify-between">
                              <h2>{proposal.title}</h2>
                              <button
                                className="btn-sm btn-brand py-1.5"
                                onClick={async () => {
                                  // window.open(
                                  //   `https://snapshot.org/#/majac.eth/proposal/${proposal.id}`
                                  // );
                                  await getProposal(proposal.id);
                                }}
                              >
                                Vote
                              </button>
                            </div>
                          </div>
                        ))}
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
