'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  Users,
  BarChart3,
  Bell,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Exercises', href: '/exercises', icon: Dumbbell },
  { name: 'Workouts', href: '/workouts', icon: Activity },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Audit Logs', href: '/audit-logs', icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-gradient-to-b from-primary/5 to-background border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b bg-background/50 backdrop-blur-sm">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">SportifyLife</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110',
                    !collapsed && 'mr-3'
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-1 h-1 rounded-full bg-primary-foreground" />
                    )}
                  </>
                )}
                {collapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4" />

        {/* Settings & Logout */}
        <div className="space-y-1">
          <Link
            href="/settings"
            className={cn(
              'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative',
              'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            <Settings
              className={cn(
                'h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110',
                !collapsed && 'mr-3'
              )}
            />
            {!collapsed && <span>Settings</span>}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                Settings
              </span>
            )}
          </Link>
          
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative',
              'text-destructive hover:bg-destructive/10'
            )}
          >
            <LogOut
              className={cn(
                'h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110',
                !collapsed && 'mr-3'
              )}
            />
            {!collapsed && <span>Logout</span>}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
                Logout
              </span>
            )}
          </button>
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2025 SportifyLife</p>
          </div>
        </div>
      )}
    </div>
  )
}
