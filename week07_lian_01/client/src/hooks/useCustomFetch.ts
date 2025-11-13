import { useCallback, useEffect, useState } from "react";

export function useCustomFetch<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const run = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await fetcher();
      setData(result);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, isLoading, isError, refetch: run };
}