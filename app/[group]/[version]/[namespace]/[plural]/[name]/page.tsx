'use client'

import { Params } from "@/app/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: Params }) {
  const pathname = usePathname();

  const [View, setView] = useState<any | null>(null);
  const [obj, setObj] = useState<any | null>(null);
  useEffect(() => {
    fetch(`/api/${pathname}`).then(res => res.json()).then(data => {
      setObj(data);
    });
  }, [pathname]);

  useEffect(() => {
    import(`@/components/views/${params.group}/${params.version}/${params.plural}.tsx`).then(module => {
      setView(() => module.default);
    });
  }, [params.group, params.version, params.plural]);


  return (View && obj) ? <View obj={obj}/> : <div>Loading...</div>;
}