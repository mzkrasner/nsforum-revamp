import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface QueryParams {
  [key: string]: string | null;
}

const useUpdateQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateQueryParams = (params: QueryParams) => {
    const currentParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, value);
      }
    });

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return updateQueryParams;
};

export default useUpdateQueryParams;
