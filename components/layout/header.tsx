'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Bell, User, Settings, LogOut, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { usePathname } from 'next/navigation'

const getPageTitle = (pathname: string): string => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/exercises': 'Exercise Management',
    '/workouts': 'Workout Management',
    '/users': 'User Management',
    '/analytics': 'Analytics & Insights',
    '/notifications': 'Notifications',
    '/audit-logs': 'Audit Logs',
    '/settings': 'Settings',
  }
  
  for (const [path, title] of Object.entries(titles)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      return title
    }
  }
  
  return 'Dashboard'
}

export function Header() {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const getInitials = (name?: string) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Page Title & Search */}
        <div className="flex items-center space-x-4 flex-1">
          <div>
            <h1 className="text-xl font-bold text-foreground">{pageTitle}</h1>
            <p className="text-xs text-muted-foreground">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          
          <div className="hidden md:flex items-center w-full max-w-sm ml-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="pl-9 pr-4 w-full bg-muted/50"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-accent cursor-pointer transition-colors">
                  <p className="text-sm font-medium">New exercise seeded</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    100 exercises have been successfully added
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
                </div>
                <DropdownMenuSeparator />
                <div className="p-3 hover:bg-accent cursor-pointer transition-colors">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    John Doe just signed up
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </div>
                <DropdownMenuSeparator />
                <div className="p-3 hover:bg-accent cursor-pointer transition-colors">
                  <p className="text-sm font-medium">System update</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    New features are available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="ghost" className="w-full text-sm" size="sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 px-2 hover:bg-accent">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium leading-none">{user?.name || 'Admin'}</span>
                    <span className="text-xs text-muted-foreground leading-none mt-1">
                      {user?.role || 'Administrator'}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Admin'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'admin@sportifylife.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
