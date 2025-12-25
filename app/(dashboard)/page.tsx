'use client'

import { useQuery } from '@tanstack/react-query'
import { exercisesApi } from '@/lib/api/exercises'
import { workoutsApi } from '@/lib/api/workouts'
import { usersApi } from '@/lib/api/users'
import { analyticsApi } from '@/lib/api/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Dumbbell, Activity, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  // Fetch analytics overview
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsApi.getOverview(),
  })

  // Fetch exercise stats
  const { data: exerciseStats } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: () => exercisesApi.getExerciseStats(),
  })

  const stats = analyticsData?.data

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend,
    isLoading 
  }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{formatNumber(value || 0)}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 text-xs mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                <span>{trend.value}% from last month</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with SportifyLife today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={Users}
          description="Registered users"
          trend={stats?.userGrowth && {
            positive: stats.userGrowth.growth > 0,
            value: Math.abs(stats.userGrowth.growth).toFixed(1)
          }}
          isLoading={analyticsLoading}
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers}
          icon={TrendingUp}
          description="Active this month"
          isLoading={analyticsLoading}
        />
        <StatCard
          title="Total Exercises"
          value={stats?.totalExercises || exerciseStats?.data?.totalExercises}
          icon={Dumbbell}
          description="In exercise library"
          isLoading={analyticsLoading}
        />
        <StatCard
          title="Total Workouts"
          value={stats?.totalWorkouts}
          icon={Activity}
          description="Workout templates"
          isLoading={analyticsLoading}
        />
      </div>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(stats?.workoutStats?.completed || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully finished
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(stats?.workoutStats?.inProgress || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently ongoing
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Abandoned</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(stats?.workoutStats?.abandoned || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Not completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/exercises">
              <Button className="w-full" variant="outline">
                <Dumbbell className="h-4 w-4 mr-2" />
                Manage Exercises
              </Button>
            </Link>
            <Link href="/workouts">
              <Button className="w-full" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Manage Workouts
              </Button>
            </Link>
            <Link href="/users">
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
            <Link href="/analytics">
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Popular Exercises */}
      {stats?.exerciseStats?.mostPopular && stats.exerciseStats.mostPopular.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Exercises</CardTitle>
            <CardDescription>Top performing exercises this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.exerciseStats.mostPopular.map((exercise: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(exercise.count)} completions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatNumber(exercise.count)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
