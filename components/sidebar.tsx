'use client'

import * as React from "react"
import { ChevronDown, ChevronRight, Home, Settings, Users, FileText, BarChart } from "lucide-react"

type MenuItem = {
  icon: React.ElementType
  label: string
  href?: string
  submenu?: Omit<MenuItem, "icon" | "submenu">[]
}

const menuItems: MenuItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  {
    icon: Users,
    label: "Users",
    submenu: [
      { label: "All Users", href: "/users" },
      { label: "Add User", href: "/users/add" },
      { label: "User Roles", href: "/users/roles" },
    ],
  },
  {
    icon: FileText,
    label: "Reports",
    submenu: [
      { label: "Sales Report", href: "/reports/sales" },
      { label: "Inventory Report", href: "/reports/inventory" },
    ],
  },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

function Collapsible({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && <div>{children}</div>}
    </div>
  )
}

function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function MenuItem({ item }: { item: MenuItem }) {
  if (item.submenu) {
    return (
      <Collapsible
        trigger={
          <Button className="w-full justify-between">
            <span className="flex items-center">
              {React.createElement(item.icon, { className: "mr-2 h-4 w-4" })}
              {item.label}
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        }
      >
        <div className="ml-4 mt-1 space-y-1">
          {item.submenu.map((subItem) => (
            <Button key={subItem.label} className="w-full justify-start pl-6">
              {subItem.label}
            </Button>
          ))}
        </div>
      </Collapsible>
    )
  }

  return (
    <Button className="w-full justify-start">
      {React.createElement(item.icon, { className: "mr-2 h-4 w-4" })}
      {item.label}
    </Button>
  )
}

export function Sidebar() {
  return (
    <div className="flex w-64 flex-col bg-white border-r">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">My App</h2>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => (
          <MenuItem key={item.label} item={item} />
        ))}
      </nav>
    </div>
  )
}