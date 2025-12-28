'use client'

import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'
import { usersApi } from '@/lib/api/users'
import { workoutsApi } from '@/lib/api/workouts'
import { exercisesApi } from '@/lib/api/exercises'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Dumbbell,
  Calendar,
  Target
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AnalyticsPage() {
  // Fetch overview data
  const { data: overviewData, isLoading: overviewLoading, isError: overviewError, error: overviewErrorObj } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => analyticsApi.getOverview(),
    retry: 1,
  })

  // Fetch chart data
  const { data: chartsData, isLoading: chartsLoading } = useQuery({
    queryKey: ['analytics', 'charts'],
    queryFn: () => analyticsApi.getCharts(),
    retry: 1,
  })

  // Fallback queries for real data - always fetch as backup
  const { data: usersListData } = useQuery({
    queryKey: ['users-list-fallback', { limit: 1 }],
    queryFn: () => usersApi.getUsers({ limit: 1 }),
  })

  const { data: usersActiveData } = useQuery({
    queryKey: ['users-active-fallback', { status: 'active', limit: 1 }],
    queryFn: () => usersApi.getUsers({ limit: 1, status: 'active' }),
  })

  const { data: workoutsListData } = useQuery({
    queryKey: ['workouts-list-fallback', { limit: 1 }],
    queryFn: () => workoutsApi.getWorkouts({ limit: 1 }),
  })

  const { data: exerciseStats } = useQuery({
    queryKey: ['exercise-stats-fallback'],
    queryFn: () => exercisesApi.getExerciseStats(),
  })

  const overview = overviewData?.data
  const charts = chartsData?.data

  // Transform user activity data for chart
  const userActivityData = charts?.userActivity?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: item.count,
  })) || []

  // Transform exercise distribution data - use fallback from exercise stats
  const exerciseDistData = charts?.exerciseDistribution && charts.exerciseDistribution.length > 0 
    ? charts.exerciseDistribution.map((item: any) => ({
        name: item.bodyPart || 'Unknown',
        value: item.count,
      }))
    : exerciseStats?.data?.data?.bodyParts 
      ? Object.entries(exerciseStats.data.data.bodyParts).map(([bodyPart, count]) => ({
          name: bodyPart,
          value: count as number,
        }))
      : []

  // Transform workout popularity data
  const workoutPopData = charts?.workoutPopularity?.map((item: any) => ({
    name: item.name,
    completions: item.count,
  })) || []

  return (
    <div className="space-y-6">
      {/* Show error if analytics failed to load */}
      {overviewError && (
        <Alert>
          <AlertDescription>
            Failed to load analytics overview: {overviewErrorObj?.message ?? 'Unknown error'}. Using fallback data from individual APIs.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalUsers ?? (usersListData?.data?.data?.pagination?.total ?? 0))}</div>
                <p className="text-xs text-muted-foreground">
                  Registered accounts
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(overview?.activeUsers ?? (usersActiveData?.data?.data?.pagination?.total ?? usersListData?.data?.data?.pagination?.total ?? 0))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalExercises ?? (exerciseStats?.data?.data?.totalExercises ?? 0))}</div>
                <p className="text-xs text-muted-foreground">
                  Available exercises
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalWorkouts ?? (workoutsListData?.data?.data?.pagination?.total ?? 0))}</div>
                <p className="text-xs text-muted-foreground">
                  Created workouts
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <div>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily active users over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : userActivityData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No activity data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Exercise Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              <div>
                <CardTitle>Exercise Distribution</CardTitle>
                <CardDescription>Exercises by body part</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : exerciseDistData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No exercise data available</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={exerciseDistData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {exerciseDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workout Popularity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <div>
              <CardTitle>Workout Popularity</CardTitle>
              <CardDescription>Most completed workouts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartsLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : workoutPopData.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No workout data available</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={workoutPopData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="completions" 
                  fill="#10b981" 
                  name="Completions"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
