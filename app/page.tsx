'use client'

import { Card } from "@/components/ui/card"
import apiGroups from "@/components/api-groups.json"
import { ApiGroup } from "./types";
import { useK8s } from "@/hooks/use-k8s";
import { useIcon } from "@/hooks/use-icon";

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-4">
        <Dashboard />
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="grid gap-6 max-w-6xl w-full mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        { apiGroups.map((g, i) => <ApiGroupCard key={i} apiGroup={g} />) }
      </div>
    </div>
  )
}

function ApiGroupCard({apiGroup}: { apiGroup: ApiGroup }) {
  const { map, error, isLoading } = useK8s({ group: apiGroup.group, version: apiGroup.version, plural: apiGroup.plural });
  const Icon = useIcon(apiGroup.icon);

  return (
    <Card className="flex flex-col items-center justify-center p-6 gap-4">
      <Icon className="w-10 h-10" />
      <div className="text-2xl font-semibold">{ Object.keys(map ?? {}).length }</div>
      <div className="text-muted-foreground">{apiGroup.plural}</div>
    </Card>
  )
}


