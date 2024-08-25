import usePost, {
  PostHeadingViewportPosition,
} from "@/app/posts/_hooks/usePost";
import { Level } from "@tiptap/extension-heading";
import { HTMLAttributes, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type Props = HTMLAttributes<HTMLHeadingElement> & { level: Level };
const PostHeading = ({ level, children, ...props }: Props) => {
  const { id } = props;
  const { updateHeadingViewportPosition } = usePost();

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (entry) {
      const { top, bottom } = entry.boundingClientRect;
      let viewportPosition: PostHeadingViewportPosition | null = null;
      if (inView) {
        viewportPosition = "in-view";
      } else {
        if (top < 0) {
          viewportPosition = "above";
        } else if (bottom > window.innerHeight) {
          viewportPosition = "below";
        }
      }
      if (id && viewportPosition) {
        updateHeadingViewportPosition({ id, viewportPosition });
      }
    }
  }, [inView, entry, id, updateHeadingViewportPosition]);

  switch (level) {
    case 2:
      return (
        <h2 ref={ref} {...props}>
          {children}
        </h2>
      );
    case 3:
      return (
        <h3 ref={ref} {...props}>
          {children}
        </h3>
      );
    case 4:
      return (
        <h4 ref={ref} {...props}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 ref={ref} {...props}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 ref={ref} {...props}>
          {children}
        </h6>
      );
    default:
      return <p id="unknown-heading-level">{children}</p>;
  }
};
export default PostHeading;
