"use client";

import { EditIcon, ReplyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import useProfile from "../hooks/useProfile";
import htmlToReact from "../lib/htmlToReact";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import DateDisplay from "./DateDisplay";
import DeleteCommentButton from "./DeleteCommentButton";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import User from "./User";

type Props = { comment: OrbisDBRow<CommentType> };
const CommentCard = ({ comment }: Props) => {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  const params = useParams();
  const postId = params.postId as string;

  const { profile } = useProfile();
  const { indexed_at, controller, body } = comment;

  const content = editing ? (
    <CommentForm comment={comment} cancel={() => setEditing(false)} />
  ) : (
    htmlToReact(body)
  );

  return (
    <Card>
      <CardHeader className="p-2 text-sm">
        <div className="flex flex-row items-center gap-4 space-y-0">
          <User did={controller} className="text-neutral-800" />
          <DateDisplay dateString={indexed_at} className="text-xs" />
          {!!profile && !editing && (
            <div className="ml-auto flex flex-row items-center gap-2">
              {!replying && (
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
          )}
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">{content}</CardContent>
      <CardFooter className="p-2 pt-0">
        <div className="flex-1">
          {replying && (
            <div className="mb-3 w-full">
              <CommentForm
                parentIds={{
                  parentId: comment.stream_id,
                  topParentId:
                    comment.parentId === postId
                      ? comment.stream_id
                      : comment.topParentId,
                }}
                cancel={() => setReplying(false)}
                isReply
              />
            </div>
          )}
          <CommentList
            fetchCommentsOptions={{
              postId: comment.postId,
              parentId: comment.stream_id,
            }}
            emptyContent={<></>}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
export default CommentCard;
