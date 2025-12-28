'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi, type NotificationFilters } from '@/lib/api/notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Bell,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

const NOTIFICATION_TYPES = {
  system: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  error: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
}

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [status, setStatus] = useState<string>('all')

  // Fetch notifications
  const { data: notificationsData, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', page, limit, status],
    queryFn: async () => {
      const result = await notificationsApi.getNotifications({
        page,
        limit,
        status: status && status !== 'all' ? status as 'read' | 'unread' : undefined,
      })
      return result
    },
    retry: 1,
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      toast.success('Notification marked as read')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notification as read')
    },
  })

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark all notifications as read')
    },
  })

  const notifications = notificationsData?.data?.data?.items || []
  const pagination = notificationsData?.data?.data?.pagination

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Manage system notifications and alerts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Status:</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert>
          <AlertDescription>
            Failed to load notifications: {(error as any)?.message ?? 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications ({pagination?.total || 0})
          </CardTitle>
          <CardDescription>
            System notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You don't have any notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification: any) => {
                const typeConfig = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.info
                const TypeIcon = typeConfig.icon

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 border rounded-lg transition-colors ${
                      notification.status === 'unread'
                        ? 'bg-blue-50/50 border-blue-200'
                        : 'bg-background'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${typeConfig.bg}`}>
                      <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant={notification.status === 'read' ? 'secondary' : 'default'}>
                            {notification.status}
                          </Badge>
                          {notification.status === 'unread' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {notification.link && (
                        <div className="mt-2">
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} notifications
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}