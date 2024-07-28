import { useOrbis } from "@orbisclub/components";
import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "./Badge";
import { CommentsIcon } from "./Icons";
import ProofBadge from "./ProofBadge";
import Upvote from "./Upvote";
import UrlMetadata from "./UrlMetadata";
import User from "./orbis-custom/User";

export default function PostItem({ post }) {
  const { orbis, user } = useOrbis();
  const [hasLiked, setHasLiked] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);

  /** Check if user liked this post */
  useEffect(() => {
    if (user) {
      getReaction();
    }

    async function getReaction() {
      let { data, error } = await orbis.getReaction(post.stream_id, user.did);
      if (data && data.type && data.type == "like") {
        setHasLiked(true);
      }
    }
  }, [user, orbis, post.stream_id]);

  /** Will clean description by shortening it and remove some markdown structure */
  function cleanDescription() {
    if (post.content.body) {
      let desc = post.content.body;
      const regexImage = /\!\[Image ALT tag\]\((.*?)\)/;
      const regexUrl = /\[(.*?)\]\(.*?\)/;
      desc = desc.replace(regexImage, "");
      desc = desc.replace(regexUrl, "$1");

      if (desc) {
        return desc.substring(0, 180) + "...";
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return (
    <div className="alte [&:nth-child(-n+4)]:-order-1">
      <div className="relative flex flex-row items-start p-5 pl-0">
        <div className="mr-3">
          <Upvote postId={post.stream_id} />
        </div>
        <div className="items-center space-y-6 sm:flex sm:space-x-5 sm:space-y-0">
          <div className="text-primary grow items-center justify-between space-y-5 lg:flex lg:space-x-6 lg:space-y-0">
            <div>
              <div className="mb-2">
                <h2 className="alte mb-1">
                  <Link
                    className="text-primary text-base font-medium hover:underline"
                    href={"/post/" + post.stream_id}
                  >
                    {post.content.title}
                  </Link>
                </h2>
                <p className="text-tertiary alte text-sm">
                  {cleanDescription()}
                </p>
                {/** Display URL metadata if any */}
                {post.indexing_metadata?.urlMetadata?.title && (
                  <UrlMetadata
                    showDesc={false}
                    imgSize="10rem"
                    metadata={post.indexing_metadata.urlMetadata}
                  />
                )}
              </div>
              <div className="text-secondary flex flex-row items-center space-x-1.5 text-sm">
                <User details={post.creator_details} height={35} />
                {/**<UserBadge details={post.creator_details}  />*/}
                <span className="text-secondary">in</span>
                {post.context_details?.context_details && (
                  <Badge
                    title={
                      post.context_details.context_details.displayName
                        ? post.context_details.context_details.displayName
                        : post.context_details.context_details.name
                    }
                    color="bg-brand-400"
                  />
                )}

                <span className="text-tertiary ml-2 mr-2 hidden md:flex">
                  ·
                </span>

                {/** Show count replies if any */}
                {post.count_replies && post.count_replies > 0 ? (
                  <>
                    <Link
                      href={"/post/" + post.stream_id}
                      className="text-primary border-primary hidden items-center space-y-2 rounded-md border px-2 py-1 text-xs font-medium hover:border hover:underline md:flex"
                    >
                      {post.count_replies}{" "}
                      <CommentsIcon style={{ marginLeft: 3 }} />
                    </Link>
                    <span className="text-tertiary ml-2 mr-2 hidden md:flex">
                      ·
                    </span>
                  </>
                ) : (
                  <></>
                )}

                {/** Proof link to Cerscan */}
                {post.stream_id && <ProofBadge stream_id={post.stream_id} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
