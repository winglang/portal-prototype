'use client'

import { Params } from "@/app/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useK8s } from "@/hooks/use-k8s";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: Params }) {
  const [View, setView] = useState<any | null>(null);

  const { map, error, isLoading } = useK8s({ group: params.group, version: params.version, plural: params.plural });

  useEffect(() => {
    import(`@/components/views/${params.group}/${params.version}/${params.plural}.tsx`).then(module => {
      setView(() => module.default);
    });
  }, [params.group, params.version, params.plural]);

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Skeleton className="w-[100px] h-[20px] rounded-full" />
      </div>
    );
  }

  const obj = map[`${params.namespace}/${params.name}`];
  if (!obj) {
    return <div>Not found</div>
  }

  return (View && obj) ? <View obj={obj} /> : <Skeleton className="w-[100px] h-[20px] rounded-full" />
}