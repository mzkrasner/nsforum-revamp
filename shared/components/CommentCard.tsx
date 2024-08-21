"use client";

import { EditIcon, ReplyIcon } from "lucide-react";
import { useState } from "react";
import useProfile from "../hooks/useProfile";
import htmlToReact from "../lib/htmlToReact";
import { OrbisDBRow } from "../types";
import { CommentType } from "../types/comment";
import CommentForm from "./CommentForm";
import DateDisplay from "./DateDisplay";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import User from "./User";

type Props = { comment: OrbisDBRow<CommentType> };
const CommentCard = ({ comment }: Props) => {
  const [editing, setEditing] = useState(false);

  const { profile } = useProfile();
  const { indexed_at, controller, body } = comment;

  const content = editing ? (
    <CommentForm comment={comment} cancel={() => setEditing(false)} />
  ) : (
    htmlToReact(body)
  );

  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex flex-row items-center gap-4 space-y-0 text-sm">
          <User did={controller} className="text-neutral-800" />
          <DateDisplay dateString={indexed_at} className="text-xs" />
          <div className="ml-auto flex flex-row items-center gap-2">
            {!!profile && !editing && (
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex h-8 items-center gap-2 px-1.5 text-neutral-500"
              >
                <ReplyIcon size={14} />
                Reply
              </Button>
            )}
            {profile?.controller === controller && !editing && (
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex h-8 items-center gap-2 px-1.5 text-neutral-500"
                onClick={() => setEditing(true)}
              >
                <EditIcon size={14} />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-sm">{content}</CardContent>
    </Card>
  );
};
export default CommentCard;
