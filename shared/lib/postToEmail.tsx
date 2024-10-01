"use server";

import { env } from "@/env";
import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { render } from "@react-email/render";
import { Section } from "@react-email/section";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";
import {
  Text as DomText,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
import DateDisplay from "../components/DateDisplay";
import { OrbisDBRow } from "../types";
import { Post } from "../types/post";
import htmlToReact from "./htmlToReact";

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode instanceof DomText) {
      return <>{domNode.data}</>;
    }

    if (domNode instanceof Element) {
      const { name, children, attribs, attributes } = domNode;
      const childNodes = domToReact(children as any, options);
      switch (name) {
        case "p":
          return <Text>{childNodes}</Text>;
        case "h1":
          return (
            <Heading as="h1" className="font-medium">
              {childNodes}
            </Heading>
          );
        case "h2":
          return (
            <Heading as="h2" className="font-medium">
              {childNodes}
            </Heading>
          );
        case "h3":
          return (
            <Heading as="h3" className="font-medium">
              {childNodes}
            </Heading>
          );
        case "h4":
          return (
            <Heading as="h4" className="font-medium">
              {childNodes}
            </Heading>
          );
        case "h5":
          return (
            <Heading as="h5" className="font-medium">
              {childNodes}
            </Heading>
          );
        case "h6":
          return (
            <Heading as="h6" className="font-medium">
              {childNodes}
            </Heading>
          );
        default:
          return;
      }
    }

    return;
  },
};

const postToEmail = async (post: OrbisDBRow<Post>) => {
  const { title, body, indexed_at, author_username, controller, slug } = post;
  const authorLink = `${env.BASE_URL}/users/${controller}`;
  const postLink = `${env.BASE_URL}/posts/${slug}`;
  const emailComponent = (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Tailwind>
        <Body className="font-serif">
          <Container>
            <Heading as="h1" className="text-center font-medium">
              {title}
            </Heading>
            <Text className="text-center text-sm">
              By <Link href={authorLink}>{author_username}</Link> on{" "}
              <DateDisplay dateString={indexed_at} />
            </Text>
            <Text className="text-center">
              <Link
                href={postLink}
                className="mx-auto border border-neutral-700"
              >
                Read on the forum
              </Link>
            </Text>
            <Hr />
            <Section>{htmlToReact(body, options)}</Section>
            <Section>
              <Text className="text-center">
                <Link
                  href={`${postLink}#comments`}
                  className="mx-auto border border-neutral-700"
                >
                  Comment
                </Link>
              </Text>
            </Section>
          </Container>
          <Container className="mt-5">
            <Text className="text-center text-neutral-500">
              You can <Link href={authorLink}>unsubscribe</Link> to{" "}
              {author_username} or{" "}
              <Link href={`${env.BASE_URL}/profile/edit#notifications`}>
                manage notification settings
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
  return await render(emailComponent);
};

export default postToEmail;
