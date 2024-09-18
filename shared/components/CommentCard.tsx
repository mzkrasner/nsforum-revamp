"use client";

import { istartsWith } from "@useorbis/db-sdk/operators";
import { EditIcon, ReplyIcon } from "lucide-react";
import { useState } from "react";
import useProfile from "../hooks/useProfile";
import htmlToReact from "../lib/htmlToReact";
import { FetchCommentsArg } from "../orbis/queries";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import CardReaction from "./CardReaction";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import DateDisplay from "./DateDisplay";
import DeleteCommentButton from "./DeleteCommentButton";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import UserDisplay from "./UserDisplay";

type Props = {
  comment: OrbisDBRow<CommentType>;
  noReplies?: boolean;
  parentIds?: string[];
  fetchCommentsArg: FetchCommentsArg;
};
const CommentCard = ({
  comment,
  noReplies = false,
  parentIds: olderParentIds = [],
  fetchCommentsArg,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  const { profile } = useProfile();
  const { indexed_at, controller, body, author_username } = comment;

  const content = editing ? (
    <CommentForm
      comment={comment}
      cancel={() => setEditing(false)}
      fetchCommentsArg={fetchCommentsArg}
      parentIds={olderParentIds}
    />
  ) : (
    htmlToReact(body)
  );

  const parentIds = [...olderParentIds, comment.stream_id];

  const fetchRepliesArg = {
    filter: {
      post_id: comment.post_id,
      parent_ids: istartsWith(parentIds.join("-")),
    },
  };

  return (
    <Card>
      <CardHeader className="p-2 text-sm">
        <div className="flex flex-row items-center gap-2 space-y-0 text-xs">
          <UserDisplay
            did={controller}
            className="text-neutral-800"
            placeholder={author_username}
          />
          <span className="text-neutral-400">on</span>
          <DateDisplay dateString={indexed_at} className="text-xs" />
          <CardReaction content={comment} model="comments" />
          {!!profile && !editing && (
            <>
              <div className="ml-auto flex flex-row items-center gap-2">
                {!replying && !noReplies && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
                    onClick={() => setReplying(true)}
                  >
                    <ReplyIcon size={14} />
                  </Button>
                )}
                {profile?.controller === controller && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="inline-flex h-7 w-7 items-center px-0 text-neutral-500"
                      onClick={() => setEditing(true)}
                    >
                      <EditIcon size={14} />
                    </Button>
                    <DeleteCommentButton commentId={comment.stream_id} />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0 text-sm">{content}</CardContent>
      <CardFooter className="p-2 pt-0">
        <div className="flex-1">
          {replying && (
            <div className="mb-3 w-full">
              <CommentForm
                cancel={() => setReplying(false)}
                fetchCommentsArg={fetchRepliesArg}
                parentIds={parentIds}
                isReply
              />
            </div>
          )}
          {!noReplies && (
            <CommentList
              fetchCommentsArg={fetchRepliesArg}
              emptyContent={<></>}
              parentIds={parentIds}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
export default CommentCard;
