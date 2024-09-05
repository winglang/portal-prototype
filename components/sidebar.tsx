'use client'
import * as React from "react"
import { AlertTriangle, Box, ChevronDown, ChevronRight, Loader } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIcon } from "@/hooks/use-icon"

type MenuItem = {
  icon?: React.ElementType
  label: string
  loading?: boolean
  href?: string
  isLoading?: boolean
  children?: MenuItem[]
  error?: Error
}

function Indicator({ isOpen, item }: { isOpen: boolean, item: MenuItem }) {
  if (item.error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </TooltipTrigger>
          <TooltipContent>
            {item.error.message}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!isOpen) {
    return <ChevronRight className="h-4 w-4" />
  }

  if (item.isLoading) {
    return <Loader className="h-4 w-4 animate-spin" />
  }

  return <ChevronDown className="h-4 w-4" />
}

function MenuItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname();

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-1 hover:bg-accent rounded-md">
          <div className="flex items-center space-x-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </div>
          <Indicator isOpen={isOpen} item={item} />
        </CollapsibleTrigger>
        {item.children.length ? <CollapsibleContent>
          <div className={cn("pl-4", level === 0 ? "border-l border-border ml-2 mt-1" : "")}>
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} level={level + 1} />
            ))}
          </div>
        </CollapsibleContent> : <></>}
      </Collapsible>
    )
  }

  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href ?? "/"}
      className={cn("flex items-center p-1 rounded-md", isActive ? "bg-primary" : "", isActive ? "hover:bg-primary-hover" : "hover:bg-accent")}
    >
      <div className="flex items-center w-full">
        {item.icon && <item.icon className={cn("h-4 w-4 flex-shrink-0 mr-2", isActive ? "text-primary-foreground" : "text-foreground")} />}
        <span className={cn("flex-grow truncate", isActive ? "text-primary-foreground" : "text-foreground")}>{item.label}</span>
        {item.loading && <Loader className="h-4 w-4 animate-spin flex-shrink-0 ml-2" />}
      </div>
    </Link>
  )
}

function SidebarSection({ api }: { api: ApiGroup }) {
  const { map, error, isLoading } = useK8s(api);
  const Icon = useIcon(api.icon);

  const children: MenuItem[] = Object.values(map ?? {}).map((item: any) => ({
    icon: Icon,
    label: item.metadata.name,
    href: `/${api.group}/${api.version}/${api.plural}/${item.metadata.namespace ?? "default"}/${item.metadata.name}`,
  }));

  return <MenuItem item={{ label: api.plural, icon: Icon, children, isLoading, error }} />
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