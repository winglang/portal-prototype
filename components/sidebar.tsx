'use client'


import * as React from "react"
import { ChevronDown, ChevronRight, Loader } from "lucide-react"
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

type MenuItem = {
  icon?: React.ElementType
  label: string
  loading?: boolean
  href?: string
  children?: MenuItem[]
}

type ApiGroup = {
  group: string
  version: string
  icon: string
  plural: string
}

function MenuItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.children?.length) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
          <div className="flex items-center space-x-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            <span>{item.label}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className={cn("pl-4", level === 0 ? "border-l border-border ml-2 mt-2" : "")}>
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
      className="flex items-center space-x-1 p-2 hover:bg-accent rounded-md"
    >
      <div className="flex justify-between w-full">
        <div className="flex items-center space-x-2">
          {item.icon && <item.icon className="h-4 w-4" />}
          <span>{item.label}</span>
        </div>
        {item.loading && <Loader className="h-4 w-4 animate-spin" />}
      </div>
    </Link>
  )
}

/*
const menuItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  {
    icon: Users,
    label: "User Management",
    children: [
      { icon: Users, label: "All Users", href: "/users" },
      { icon: Users, label: "Add User", href: "/users/add" },
    ],
  },
  {
    icon: FileText,
    label: "Content",
    children: [
      { icon: FileText, label: "Articles", href: "/content/articles" },
      { icon: FileText, label: "Pages", href: "/content/pages" },
    ],
  },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
]
*/

function SidebarSection({ api }: { api: ApiGroup }) {
  const [Icon, setIcon] = React.useState<React.ElementType | undefined>(undefined);
  const { data, error, isLoading } = useK8s(api);

  React.useEffect(() => setIcon(React.lazy(icons[api.icon as keyof typeof icons])), [api]);

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isLoading) {
    return <MenuItem item={{ label: api.plural, loading: true }} />
  }

  const children: MenuItem[] = data?.items.map((item: any) => ({
    icon: Icon,
    label: item.metadata.name,
    href: `/${api.group}/${api.version}/${api.plural}/${item.metadata.namespace ?? "default"}/${item.metadata.name}`,
  }));

  return <MenuItem item={{ label: api.plural, icon: Icon, children }} />
}

export function Sidebar() {
  return (
    <div className="min-w-64 bg-background border-r border-border p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
      <nav>
        {apiGroups.map((api, index) => (
          <SidebarSection key={index} api={api} />
        ))}
      </nav>
    </div>
  )
}