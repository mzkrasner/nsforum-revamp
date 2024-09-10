import { useEffect } from "react";
import { IntersectionOptions, useInView } from "react-intersection-observer";

type Props = {
  observerOptions?: IntersectionOptions;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<any>;
};

const useInfiniteScroll = ({
  observerOptions,
  hasNextPage,
  fetchNextPage,
}: Props) => {
  const res = useInView(observerOptions);
  const { inView } = res;

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return res;
};

export default useInfiniteScroll;
