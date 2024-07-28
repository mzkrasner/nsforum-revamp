import React, { useState, useRef, useEffect, useMemo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
	useOrbis,
	User,
	AccessRulesModal,
	checkContextAccess,
} from "@orbisclub/components";
import Link from "next/link";
import {
	ExternalLinkIcon,
	LoadingCircle,
} from "./Icons";
import useSinglePost from "../hooks/useSinglePost";
import useContexts from "../hooks/useContexts";
import Tiptap from './Tiptap';
// import TurndownService from 'turndown';
import { htmlToText } from "html-to-text";
import showdown from 'showdown';

// const turndownService = new TurndownService();

const converter = new showdown.Converter()

const NewEditor = ({ post }) => {
	const { orbis, user, credentials } = useOrbis();
	const [title, setTitle] = useState(
		post?.content?.title ? post.content.title : ""
	);
	const [htmlContent, setHtmlContent] = useState(
		post?.content?.body ? post.content.body : ""
	);
	const [media, setMedia] = useState(
		post?.content?.media ? post.content.media : []
	);
	const [mediaLoading, setMediaLoading] = useState(false);
	const [category, setCategory] = useState(
		post?.content?.context ? post.content.context : ""
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
    return post?.content?.body ? 
      converter.makeHtml(post.content.body) : 
      undefined
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
				(response) => response.json()
			);
			if (gotAttestations.data.accountAttestationIndex == null) return;
			const arr = gotAttestations.data.accountAttestationIndex.edges.map(
				(a) =>
					new Object({
						attester: `did:pkh:eip155:1:${a.node.attester}`,
						recipient: `did:pkh:eip155:1:${a.node.recipient}`,
					})
			);
			const uniqueArr = [...new Set(arr)];
			const multipleRecipients = uniqueArr.filter(
				//isolate instances where the recipient value appears more than once
				(a) => uniqueArr.filter((b) => b.recipient === a.recipient).length > 1
			);

			const final = [...new Set(multipleRecipients.map((a) => a.recipient))];
			final.push({ category });
			const newOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(final),
			};
			const update = await fetch("/api/update", newOptions).then((response) =>
				response.json()
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
					(item) => item.type === "did"
				);
				if (currAccessRules.length > 0) {
					await updateList(category);
				}
			}
			if (data && data.content) {
				/** Save context access rules in state */
				setCategoryAccessRules(
					data?.content.accessRules ? data?.content.accessRules : []
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
						setHasAccess(true)
					);
				}
			}
			setAccessRulesLoading(false);
		}
	}, [category, credentials]);

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

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataOneTimeJWT}`,
        },
        body: formData,
      }
    );
    if (res.status == 200) {
      const json = await res.json();
      const { IpfsHash } = json;
      const url = `https://${'violet-deliberate-marten-707.mypinata.cloud'}/ipfs/${IpfsHash}`;
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
				<div className="flex flex-row mb-4 text-primary">
					{post && (
						<Link
							href={"/post/" + post.stream_id}
							className={`btn items-center flex flex-row`}
						>
							<ExternalLinkIcon style={{ marginRight: 4 }} /> View live
						</Link>
					)}
				</div>
			)}

			{/** Post Editor or Loading state */}
			<div className="w-full">
        {accessRulesLoading ? (
          <div className="p-6 w-full flex justify-center text-gray-900">
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
                      className="resize-none w-full h-full p-3 bg-transparent text-[var(--primary-color)] border focused:border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
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
                          <div className="flex mt-4 justify-center">
                            <div className="text-gray-600 flex flex-row items-center">
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
                            className="btn-sm w-full btn-brand btn-brand-hover mt-2"
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
                      <button className="btn-sm w-full bg-brand bg-brand-hover mt-2">
                        Loading...
                      </button>
                    )}

                    {/** success status */}
                    {(editPostMutation.isSuccess ||
                      createPostMutation.isSuccess) && (
                      <button className="btn-sm w-full text-slate-100 bg-green-500 mt-2">
                        Success
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full text-center bg-white/10 rounded border border-[#619575] p-6">
                    <p className="text-base text-secondary mb-2">
                      You can&apos;t share a post in this category as
                      it&apos;s restricted to users who have received more
                      than two attestations from another user.
                    </p>
                    <button
                      className="btn-sm py-1.5 btn-brand"
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
	}, [contexts]);

	return (
		<div className="flex flex-col mt-2 mb-4 items-center text-sm">
			<span className="text-primary font-medium text-base">
				Which category do you want to share your post into?
			</span>
			<div className="flex flex-row flex-wrap space-x-2 mt-2">
				{categories.map((cat) => {
					return (
						<div
							className={`flex flex-row btn rounded-full py-1.5 px-3 cursor-pointer ${
								category == cat.stream_id
									? "bg-blue-100 border border-blue-400"
									: "bg-white border border-slate-300 hover:border-slate-400 bg-slate-50 text-gray-900"
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
