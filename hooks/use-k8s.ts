import useSWR from "swr"

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())

export function useK8s({ group, version, plural }: { group: string, version: string, plural: string }) {
  console.log(group, version, plural);
  const { data, error, isLoading } = useSWR(`/api/${group}/${version}/${plural}`, {
    fetcher: async (...args: Parameters<typeof fetch>) => {
      const res = await fetch(...args);
      const data = await res.json();

      const map: Record<string, any> = {};

      data?.items.forEach((item: any) => {
        map[`${item.metadata.namespace}/${item.metadata.name}`] = item;
      });

      return map;
    },
  });

  return { map: data, error, isLoading };
}