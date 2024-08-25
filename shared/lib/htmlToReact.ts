import parse, { HTMLReactParserOptions } from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

const htmlToReact = (htmlString: string, options?: HTMLReactParserOptions) => {
  const cleanHtml = DOMPurify.sanitize(htmlString);
  return parse(cleanHtml, options);
};

export default htmlToReact;
