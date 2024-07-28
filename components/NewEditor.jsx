import {
  AccessRulesModal,
  User,
  checkContextAccess,
  useOrbis,
} from "@orbisclub/components";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useContexts from "../hooks/useContexts";
import useSinglePost from "../hooks/useSinglePost";
import { ExternalLinkIcon, LoadingCircle } from "./Icons";
import Tiptap from "./Tiptap";
// import TurndownService from 'turndown';
import { htmlToText } from "html-to-text";
import showdown from "showdown";

// const turndownService = new TurndownService();

const converter = new showdown.Converter();

const NewEditor = ({ post }) => {
  const { orbis, user, credentials } = useOrbis();
  const [title, setTitle] = useState(
    post?.content?.title ? post.content.title : "",
  );
  const [htmlContent, setHtmlContent] = useState(
    post?.content?.body ? post.content.body : "",
  );
  const [media, setMedia] = useState(
    post?.content?.media ? post.content.media : [],
  );
  const [mediaLoading, setMediaLoading] = useState(false);
  const [category, setCategory] = useState(
    post?.content?.context ? post.content.context : "",
  );
  const [categoryAccessRules, setCategoryAccessRules] = useState([]);
  const [accessRulesLoading, setAccessRulesLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessRulesModalVis, setAccessRulesModalVis] = useState(false);
  // const [status, setStatus] = useState(0);
  const [toolbarStyle, setToolbarStyle] = useState({});
  const [pinataOneTimeJWT, setPinataOneTimeJWT] = useState();
  const [pinataJWTFetchIndex, setPinataJWTFetchIndex] = useState(0);

  const textareaRef = useRef();

  const initialHtmlContent = useMemo(() => {
    return post?.content?.body
      ? converter.makeHtml(post.content.body)
      : undefined;
  }, [post?.content?.body]);

  /** Will load the details of the context and check if user has access to it  */
  useEffect(() => {
    if (category && category != "") {
      loadContextDetails();
    }

    async function updateList(category) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      const gotAttestations = await fetch("/api/getList", requestOptions).then(
        (response) => response.json(),
      );
      if (gotAttestations.data.accountAttestationIndex == null) return;
      const arr = gotAttestations.data.accountAttestationIndex.edges.map(
        (a) =>
          new Object({
            attester: `did:pkh:eip155:1:${a.node.attester}`,
            recipient: `did:pkh:eip155:1:${a.node.recipient}`,
          }),
      );
      const uniqueArr = [...new Set(arr)];
      const multipleRecipients = uniqueArr.filter(
        //isolate instances where the recipient value appears more than once
        (a) => uniqueArr.filter((b) => b.recipient === a.recipient).length > 1,
      );

      const final = [...new Set(multipleRecipients.map((a) => a.recipient))];
      final.push({ category });
      const newOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(final),
      };
      const update = await fetch("/api/update", newOptions).then((response) =>
        response.json(),
      );

      console.log(update);
    }

    async function loadContextDetails() {
      setAccessRulesLoading(true);
      setHasAccess(false);
      let { data, error } = await orbis.getContext(category);
      console.log("Context details", data);
      if (data?.content.accessRules.length > 0) {
        const currAccessRules = data?.content.accessRules.filter(
          (item) => item.type === "did",
        );
        if (currAccessRules.length > 0) {
          await updateList(category);
        }
      }
      if (data && data.content) {
        /** Save context access rules in state */
        setCategoryAccessRules(
          data?.content.accessRules ? data?.content.accessRules : [],
        );

        /** Now check if user has access */
        if (
          !data?.content.accessRules ||
          data?.content.accessRules.length == 0
        ) {
          setHasAccess(true);
        } else {
          console.log("Checking access rules...");
          checkContextAccess(user, data?.content?.accessRules, () =>
            setHasAccess(true),
          );
        }
      }
      setAccessRulesLoading(false);
    }
  }, [category, credentials, orbis, user]);

  /** Triggered on component launch */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** Triggered when fetch index is updated **/

  useEffect(() => {
    const getPinataOneTimeJWT = async () => {
      setMediaLoading(true);
      const jwtRes = await fetch("/api/pinata/oneTimeJWT", {
        method: "GET",
      });
      const oneTimeJWT = await jwtRes.text();
      setPinataOneTimeJWT(oneTimeJWT);
      setMediaLoading(false);
    };
    getPinataOneTimeJWT();
  }, [pinataJWTFetchIndex]);

  /** Will be triggered on scroll to update the toolbar style */
  const handleScroll = () => {
    if (textareaRef.current) {
      const rect = textareaRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        setToolbarStyle({ position: "fixed", top: 0, marginLeft: 8 });
      } else {
        setToolbarStyle({});
      }
    }
  };

  /** Will update title field */
  const handleTitleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const { editPostMutation, createPostMutation } = useSinglePost({
    postId: post?.stream_id,
  });

  /** Will edit the post to publish the new version */
  async function updateArticle() {
    const textContent = htmlToText(htmlContent);
    if (!title || !textContent.trim()) return null;

    // turndownService.keep(['iframe'])
    // const markdown = turndownService.turndown(htmlContent);
    const markdown = converter.makeMarkdown(htmlContent);
    const body = markdown;

    if (post) {
      await editPostMutation.mutateAsync({
        ...post.content,
        title,
        body,
        media,
        context: category ? category : global.orbis_context,
      });
    } else {
      await createPostMutation.mutateAsync({
        title: title,
        body: body,
        context: category ? category : global.orbis_context,
        media: media,
      });
    }
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file, { filename: file.name });

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataOneTimeJWT}`,
      },
      body: formData,
    });
    if (res.status == 200) {
      const json = await res.json();
      const { IpfsHash } = json;
      const url = `https://${"violet-deliberate-marten-707.mypinata.cloud"}/ipfs/${IpfsHash}`;
      console.log(url);
      return url;
    } else {
      throw new Error();
    }
  }

  const loading = editPostMutation.isPending || createPostMutation.isPending;

  return (
    <div className="container mx-auto text-gray-900">
      {/** Loop categories */}
      <Categories category={category} setCategory={setCategory} />

      {/** Update view */}
      {category && category != "" && (
        <div className="text-primary mb-4 flex flex-row">
          {post && (
            <Link
              href={"/post/" + post.stream_id}
              className={`btn flex flex-row items-center`}
            >
              <ExternalLinkIcon style={{ marginRight: 4 }} /> View live
            </Link>
          )}
        </div>
      )}

      {/** Post Editor or Loading state */}
      <div className="w-full">
        {accessRulesLoading ? (
          <div className="flex w-full justify-center p-6 text-gray-900">
            <LoadingCircle />
          </div>
        ) : (
          <div>
            {/** Render text inputs only if the category has been selected */}
            {category && category != "" && (
              <>
                {/** If user has access we disply the form */}
                {hasAccess ? (
                  <>
                    {/** Title */}
                    <TextareaAutosize
                      ref={textareaRef}
                      className="focused:border-gray-500 h-full w-full resize-none rounded-md border bg-transparent p-3 text-base text-[var(--primary-color)] focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Type your title here"
                      value={title}
                      onChange={handleTitleInputChange}
                    />

                    <Tiptap
                      placeholder="Write your post content here..."
                      onChange={setHtmlContent}
                      initialContent={initialHtmlContent}
                      uploadImage={uploadImage}
                    />

                    {/** Default status */}
                    {!loading && (
                      <>
                        {post && (!user || user.did != post.creator) ? (
                          <div className="mt-4 flex justify-center">
                            <div className="flex flex-row items-center text-gray-600">
                              Only{" "}
                              <div className="ml-2 mr-2 text-gray-900">
                                <User
                                  height={30}
                                  hover={true}
                                  details={post.creator_details}
                                />
                              </div>{" "}
                              can update this article.
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn-sm btn-brand btn-brand-hover mt-2 w-full"
                            onClick={() => updateArticle()}
                            disabled={!title || !htmlContent}
                          >
                            {post ? "Update" : "Share"}
                          </button>
                        )}
                      </>
                    )}

                    {/** Loading status */}
                    {loading && (
                      <button className="btn-sm bg-brand bg-brand-hover mt-2 w-full">
                        Loading...
                      </button>
                    )}

                    {/** success status */}
                    {(editPostMutation.isSuccess ||
                      createPostMutation.isSuccess) && (
                      <button className="btn-sm mt-2 w-full bg-green-500 text-slate-100">
                        Success
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full rounded border border-[#619575] bg-white/10 p-6 text-center">
                    <p className="text-secondary mb-2 text-base">
                      You can&apos;t share a post in this category as it&apos;s
                      restricted to users who have received more than two
                      attestations from another user.
                    </p>
                    <button
                      className="btn-sm btn-brand py-1.5"
                      onClick={() => setAccessRulesModalVis(true)}
                    >
                      View current whitelisted accounts:{" "}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/** Display more details about the access rules required for this context */}
      {accessRulesModalVis && (
        <AccessRulesModal
          accessRules={categoryAccessRules}
          hide={() => setAccessRulesModalVis(false)}
        />
      )}
    </div>
  );
};

/** Will loop through all categories and display them */
const Categories = ({ category, setCategory }) => {
  // const { orbis, user } = useOrbis();
  // const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const { contexts, loading } = useContexts();

  useEffect(() => {
    if (contexts && contexts.length > 0) {
      setCategories(contexts);
    } else {
      setCategory(global.orbis_context);
    }
  }, [contexts, setCategories, setCategory]);

  return (
    <div className="mb-4 mt-2 flex flex-col items-center text-sm">
      <span className="text-primary text-base font-medium">
        Which category do you want to share your post into?
      </span>
      <div className="mt-2 flex flex-row flex-wrap space-x-2">
        {categories.map((cat) => {
          return (
            <div
              className={`btn flex cursor-pointer flex-row rounded-full px-3 py-1.5 ${
                category == cat.stream_id
                  ? "border border-blue-400 bg-blue-100"
                  : "border border-slate-300 bg-slate-50 bg-white text-gray-900 hover:border-slate-400"
              }`}
              key={cat.stream_id}
              onClick={() => setCategory(cat.stream_id)}
            >
              {cat.content.displayName}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewEditor;
