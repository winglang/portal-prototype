import useSWR from "swr"

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())

export function useK8s({ group, version, plural }: { group: string, version: string, plural: string }) {
  return useSWR(`/api/${group}/${version}/${plural}`, {
    fetcher,
  });
}