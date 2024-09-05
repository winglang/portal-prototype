'use client'
import * as React from "react"
import { Box, ChevronDown, ChevronRight, Loader } from "lucide-react"
import icons from "lucide-react/dynamicIconImports"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import apiGroups from "./api-groups.json";
import Link from "next/link"
import { useK8s } from "@/hooks/use-k8s"
import { ApiGroup } from "@/app/types"
import { usePathname } from "next/navigation"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"

type MenuItem = {
  icon?: React.ElementType
  label: string
  loading?: boolean
  href?: string
  children?: MenuItem[]
}

function MenuItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname();

  if (item.children?.length) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-1 hover:bg-accent rounded-md">
          <div className="flex items-center space-x-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className={cn("pl-4", level === 0 ? "border-l border-border ml-2 mt-1" : "")}>
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} level={level + 1} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link
      href={item.href ?? "/"}
      className={cn("flex items-center p-1 hover:bg-accent rounded-md", pathname === item.href ? "bg-accent" : "")}
    >
      <div className="flex items-center w-full">
        {item.icon && <item.icon className="h-4 w-4 flex-shrink-0 mr-2" />}
        <span className="flex-grow truncate">{item.label}</span>
        {item.loading && <Loader className="h-4 w-4 animate-spin flex-shrink-0 ml-2" />}
      </div>
    </Link>
  )
}

function SidebarSection({ api }: { api: ApiGroup }) {
  const [Icon, setIcon] = React.useState<React.ElementType>(Box);
  const { map, error, isLoading } = useK8s(api);

  React.useEffect(() => {
    const i = icons[api.icon as keyof typeof icons];
    if (i) {
      setIcon(React.lazy(i))
    }
  }, [api.icon]);

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isLoading) {
    return <MenuItem item={{ label: api.plural, icon: Icon, loading: true }} />
  }

  const children: MenuItem[] = Object.values(map ?? {}).map((item: any) => ({
    icon: Icon,
    label: item.metadata.name,
    href: `/${api.group}/${api.version}/${api.plural}/${item.metadata.namespace ?? "default"}/${item.metadata.name}`,
  }));

  return <MenuItem item={{ label: api.plural, icon: Icon, children }} />
}

export function Sidebar() {
  return (
    <nav>
      {apiGroups.map((api, index) => (
        <SidebarSection key={index} api={api} />
      ))}
    </nav>
  )
}