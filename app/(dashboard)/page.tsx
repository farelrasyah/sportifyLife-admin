'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Dumbbell, 
  Activity, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Plus,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // This would normally come from an API call
  const stats = {
    totalUsers: 1250,
    userGrowth: 12.5,
    totalExercises: 1543,
    exerciseGrowth: 8.3,
    totalWorkouts: 48,
    workoutGrowth: -2.1,
    activeUsers: 892,
    activeGrowth: 15.2,
  }

  const recentActivities = [
    {
      id: 1,
      type: 'user',
      message: 'New user registered: John Doe',
      time: '5 minutes ago',
    },
    {
      id: 2,
      type: 'exercise',
      message: '100 exercises seeded successfully',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'workout',
      message: 'New workout created: Upper Body Blast',
      time: '2 hours ago',
    },
    {
      id: 4,
      type: 'user',
      message: '5 users completed workouts',
      time: '3 hours ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Monitor your application performance and user activity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              {stats.userGrowth > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.userGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.userGrowth}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              {stats.exerciseGrowth > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.exerciseGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.exerciseGrowth}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              {stats.workoutGrowth > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.workoutGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.workoutGrowth}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              {stats.activeGrowth > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{stats.activeGrowth}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500">{stats.activeGrowth}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/exercises/seeding">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Dumbbell className="mr-2 h-5 w-5" />
                Seed Exercises
              </Button>
            </Link>
            <Link href="/workouts/create">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Workout
              </Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Users className="mr-2 h-5 w-5" />
                Manage Users
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and events in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="rounded-full p-2 bg-primary/10">
                    {activity.type === 'user' && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === 'exercise' && <Dumbbell className="h-4 w-4 text-primary" />}
                    {activity.type === 'workout' && <Activity className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Overview of system health and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Status</span>
                <Badge variant="default" className="bg-green-500">Operational</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                All services running normally
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant="default" className="bg-green-500">Healthy</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Response time: 45ms
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage</span>
                <Badge variant="default" className="bg-yellow-500">65% Used</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                3.5GB / 10GB available
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
