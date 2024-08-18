import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

const htmlToReact = (htmlString: string) => {
  const cleanHtml = DOMPurify.sanitize(htmlString);
  return parse(cleanHtml);
};

export default htmlToReact;
