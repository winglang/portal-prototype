'use client'

import * as React from "react"
import { ChevronDown, ChevronRight, Home, Settings, Users, FileText, BarChart, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useEffect} from "react";

type MenuItem = {
  icon: React.ElementType
  label: string
  href?: string
  children?: MenuItem[]
}

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

function MenuItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-accent rounded-md">
          <div className="flex items-center space-x-2">
            <item.icon className="h-4 w-4" />
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
    <a
      href={item.href}
      className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </a>
  )
}

export function Sidebar() {
  const [namespaces, setNamespaces] = React.useState<string[]>(["default"])
  const [selectedNamespace, setSelectedNamespace] = React.useState("default")

  useEffect(() => {
    fetch("/api/namespaces").then(res => res.json()).then(data => {
      setNamespaces(data.namespaces)
    })
  }, []);

  return (
    <div className="min-w-64 bg-background border-r border-border p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
      <div className="mb-4">
        <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Namespace" />
          </SelectTrigger>
          <SelectContent>
            {namespaces.map((namespace) => (
              <SelectItem key={namespace} value={namespace}>
                {namespace}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </nav>
    </div>
  )
}