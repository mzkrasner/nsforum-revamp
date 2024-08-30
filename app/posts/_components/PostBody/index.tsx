"use client";

import htmlToReact from "@/shared/lib/htmlToReact";
import { Level } from "@tiptap/extension-heading";
import {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
  Text,
} from "html-react-parser";
import { useMemo } from "react";
import slugify from "slugify";
import usePost, { PostHeadingTagName } from "../../_hooks/usePost";
import PostHeading from "./components/PostHeading";

const PostBody = () => {
  const {
    postQuery: { isLoading, data },
    addPostHeading,
  } = usePost();

  const parseOptions: HTMLReactParserOptions | undefined = useMemo(
    () =>
      data?.body
        ? {
            replace: (domNode: DOMNode, index) => {
              if (
                domNode instanceof Element &&
                domNode.name?.match(/^h[1-6]$/)
              ) {
                const getContent = (element: Element) =>
                  element.children
                    .map((child) => {
                      return child instanceof Text ? child.data : "";
                    })
                    .join("");
                const content = getContent(domNode);
                const baseSlug = slugify(content, {
                  lower: true,
                  strict: true,
                  trim: true,
                }).substring(0, 50);
                let slug = `${baseSlug}-${index}`;
                const tagName = domNode.name as PostHeadingTagName;
                const level = +tagName.slice(-1) as Level;

                // Set the ID attribute
                domNode.attribs.id = slug;
                addPostHeading({
                  tagName,
                  level,
                  textContent: content,
                  id: slug,
                });
                const props = attributesToProps(domNode.attribs);
                return (
                  <PostHeading {...props} level={level}>
                    {domToReact(domNode.children as DOMNode[], parseOptions)}
                  </PostHeading>
                );
              }

              return domNode;
            },
          }
        : undefined,
    [data?.body],
  );

  if (isLoading) return "Loading...";
  if (!data) return "No data found...";

  const { body } = data;

  return (
    <div className="tiptap" id="post-body">
      {htmlToReact(body, parseOptions)}
    </div>
  );
};
export default PostBody;
