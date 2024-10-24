"use client"

import { Fingerprint, LayoutDashboard, Plus, ClipboardList, Settings, FileBarChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'New Product', href: '/new-product', icon: Plus },
  { name: 'Product List', href: '/products', icon: ClipboardList },
  { name: 'Reporting', href: '/reporting', icon: FileBarChart },
  { name: 'Settings', href: '/settings', icon: Settings }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8 flex items-center space-x-2">
          <Fingerprint className="h-6 w-6 text-[#ADFA1D]" />
          <span className="text-lg font-bold">LCAi</span>
        </div>
        <div className="flex space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-[#ADFA1D]",
                  pathname === item.href
                    ? "text-[#ADFA1D]"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}