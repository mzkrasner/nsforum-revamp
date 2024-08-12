import DOMPurify from "dompurify";
import parse from "html-react-parser";

const htmlToReact = (htmlString: string) => {
  const cleanHtml = DOMPurify.sanitize(htmlString);
  return parse(cleanHtml);
};

export default htmlToReact;
