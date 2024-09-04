'use client'

import * as React from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import icons from "lucide-react/dynamicIconImports"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import apiGroups from "./api-groups.json";
import Link from "next/link"

type MenuItem = {
  icon?: React.ElementType
  label: string
  href?: string
  children?: MenuItem[]
}

type ApiGroup = {
  group: string
  icon: string
  plural: string
}

function MenuItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.children) {
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
      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
    >
      {item.icon && <item.icon className="h-4 w-4" />}
      <span>{item.label}</span>
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

export function Sidebar() {
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);

  React.useEffect(() => {
    console.log("hello");
    async function fetchAllResources() {
      const result: MenuItem[] = [];
      for (const api of apiGroups as ApiGroup[]) {

        const object =  await fetch(`/api/${api.group}/${api.plural}`);
        const json = await object.json();

        const Icon = React.lazy(icons[api.icon as keyof typeof icons]);

        result.push({
          icon: Icon,
          label: api.plural,
          children: json.items.map((item: any) => ({
            label: item.metadata.name,
            href: `/${api.group}/${api.plural}/${item.metadata.namespace ?? "default"}/${item.metadata.name}`,
          })),
        })

      }

      setMenuItems(result);
    }

    fetchAllResources();
  }, []);

  return (
    <div className="min-w-64 bg-background border-r border-border p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
      <nav>
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </nav>
    </div>
  )
}