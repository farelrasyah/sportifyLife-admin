'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi, type User, type CreateUserPayload, type UpdateUserPayload } from '@/lib/api/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Users, 
  Filter, 
  RefreshCw,
  UserCheck,
  UserX,
  Eye,
  TrendingUp,
  Activity,
  UserPlus,
  Edit,
  Trash2,
  RotateCcw,
  Lock,
  Unlock,
  Ban,
  CheckCircle,
  AlertTriangle,
  Shield
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { formatNumber, formatDate } from '@/lib/utils'

const USER_ROLES = ['all', 'user', 'admin']
const USER_STATUSES = ['all', 'active', 'inactive']

export default function UsersPage() {
  console.log('🚀 [COMPONENT] UsersPage component mounted/rendered')

  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [showDeletedUsers, setShowDeletedUsers] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ user: User | null, permanent: boolean }>({ user: null, permanent: false })

  // Form states
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'user',
    sendInvitation: false
  })

  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    isActive: true
  })

  const [resetPasswordForm, setResetPasswordForm] = useState({ newPassword: '' })

  console.log('📊 [COMPONENT] Initial state values:', {
    page,
    limit,
    search,
    role,
    status,
    showDeletedUsers,
    showCreateDialog,
    showEditDialog,
    showResetPasswordDialog
  })
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ['users', page, limit, search, role, status],
    queryFn: async () => {
      const result = await usersApi.getUsers({
        page,
        limit,
        search: search || undefined,
        role: role && role !== 'all' ? role : undefined,
        status: status && status !== 'all' ? status : undefined,
      })
      return result
    },
    retry: 1,
  })

  // Fetch deleted users
  const { data: deletedUsersData, isLoading: deletedLoading, refetch: refetchDeleted } = useQuery({
    queryKey: ['users-deleted', page, limit, search],
    queryFn: async () => {
      return await usersApi.getDeletedUsers({
        page,
        limit,
        search: search || undefined,
      })
    },
    enabled: showDeletedUsers,
    retry: 1,
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      console.log('📡 [CREATE USER] Calling usersApi.createUser with payload:', {
        ...data,
        password: data.password ? '[HIDDEN]' : 'empty'
      })
      const startTime = Date.now()
      try {
        const result = await usersApi.createUser(data)
        const endTime = Date.now()
        console.log('✅ [CREATE USER] API call successful in', endTime - startTime, 'ms')
        console.log('📦 [CREATE USER] API response:', result)
        return result
      } catch (error) {
        const endTime = Date.now()
        console.error('❌ [CREATE USER] API call failed after', endTime - startTime, 'ms')
        console.error('🔍 [CREATE USER] API error:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      console.log('🎉 [CREATE USER] Mutation success - User created successfully')
      console.log('👤 [CREATE USER] Created user data:', data.data)
      toast.success('User created successfully')
      setShowCreateDialog(false)
      setCreateForm({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'user',
        sendInvitation: false
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      console.log('🔄 [CREATE USER] Invalidated users query cache')
    },
    onError: (error: any) => {
      console.error('💥 [CREATE USER] Mutation failed with error:', error)
      console.error('📋 [CREATE USER] Error details:', {
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data
      })
      toast.error(error?.response?.data?.error?.message || 'Failed to create user')
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UpdateUserPayload }) => 
      usersApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully')
      setShowEditDialog(false)
      setSelectedUser(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to update user')
    },
  })

  // Delete user mutation (soft delete)
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully')
      setDeleteConfirm({ user: null, permanent: false })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to delete user')
    },
  })

  // Permanent delete user mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.permanentDeleteUser(id),
    onSuccess: () => {
      toast.success('User permanently deleted')
      setDeleteConfirm({ user: null, permanent: false })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users-deleted'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to permanently delete user')
    },
  })

  // Restore user mutation
  const restoreUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.restoreUser(id),
    onSuccess: () => {
      toast.success('User restored successfully')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users-deleted'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to restore user')
    },
  })

  // Suspend user mutation
  const suspendUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.suspendUser(id),
    onSuccess: () => {
      toast.success('User suspended successfully')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to suspend user')
    },
  })

  // Activate user mutation
  const activateUserMutation = useMutation({
    mutationFn: (id: string) => usersApi.activateUser(id),
    onSuccess: () => {
      toast.success('User activated successfully')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to activate user')
    },
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, newPassword }: { id: string, newPassword: string }) => 
      usersApi.resetPassword(id, { newPassword }),
    onSuccess: () => {
      toast.success('Password reset successfully')
      setShowResetPasswordDialog(false)
      setResetPasswordForm({ newPassword: '' })
      setSelectedUser(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to reset password')
    },
  })

  // Fetch user stats
  const fetchUserStats = async (userId: string) => {
    try {
      const response = await usersApi.getUserStats(userId)
      setUserStats(response.data)
    } catch (error) {
      toast.error('Failed to load user statistics')
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    fetchUserStats(user.id)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive
    })
    setShowEditDialog(true)
  }

  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setShowResetPasswordDialog(true)
  }

  const handleDeleteUser = (user: User, permanent: boolean = false) => {
    setDeleteConfirm({ user, permanent })
  }

  const confirmDelete = () => {
    if (deleteConfirm.user) {
      if (deleteConfirm.permanent) {
        permanentDeleteMutation.mutate(deleteConfirm.user.id)
      } else {
        deleteUserMutation.mutate(deleteConfirm.user.id)
      }
    }
  }

  const handleSuspend = (userId: string) => {
    suspendUserMutation.mutate(userId)
  }

  const handleActivate = (userId: string) => {
    activateUserMutation.mutate(userId)
  }

  const handleRestore = (userId: string) => {
    restoreUserMutation.mutate(userId)
  }

  const users = usersData?.data?.data?.users || []
  const pagination = usersData?.data?.data?.pagination
  const deletedUsers = deletedUsersData?.data?.data?.users || []
  const deletedPagination = deletedUsersData?.data?.data?.pagination

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(pagination?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(users.filter((u: User) => u.status === 'active').length)}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(users.filter((u: User) => u.isVerified).length)}
            </div>
            <p className="text-xs text-muted-foreground">Email verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(users.filter((u: User) => u.role === 'admin').length)}
            </div>
            <p className="text-xs text-muted-foreground">Administrator accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeletedUsers(!showDeletedUsers)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {showDeletedUsers ? 'Active Users' : 'Deleted Users'}
              </Button>
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => {
                console.log('📂 [UI] Opening Create User Dialog')
                setShowCreateDialog(true)
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {!showDeletedUsers && (
              <>
                <Select value={role} onValueChange={(value) => { setRole(value); setPage(1); }}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>

          {/* Table */}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">Failed to load users</p>
                  <p className="text-sm">Error: {(error as any)?.message || 'Unknown error occurred'}</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : isLoading || deletedLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : showDeletedUsers ? (
            // Deleted Users Table
            deletedUsers.length === 0 ? (
              <div className="text-center py-12">
                <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No deleted users</h3>
                <p className="text-muted-foreground">All users are active</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Deleted At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deletedUsers.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profile?.profileImageUrl} />
                                <AvatarFallback>
                                  {getInitials(user.firstName, user.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(user.deletedAt!)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRestore(user.id)}
                                disabled={restoreUserMutation.isPending}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteUser(user, true)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Permanent
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination for deleted users */}
                {deletedPagination && deletedPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, deletedPagination.total)} of {deletedPagination.total} deleted users
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(deletedPagination.totalPages, p + 1))}
                        disabled={page === deletedPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground mb-4">
                {search || role !== 'all' || status !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'No users have been registered yet'
                }
              </p>
            </div>
          ) : (
            // Active Users Table
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.profile?.profileImageUrl} />
                              <AvatarFallback>
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isVerified ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                <Lock className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem 
                                  onClick={() => handleSuspend(user.id)}
                                  className="text-orange-600"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleActivate(user.id)}
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} users
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        console.log('📂 [DIALOG] Create User Dialog', open ? 'opened' : 'closed')
        setShowCreateDialog(open)
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user account to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={createForm.email}
                onChange={(e) => {
                  const newEmail = e.target.value
                  console.log('✏️ [FORM] Email changed:', newEmail)
                  setCreateForm({ ...createForm, email: newEmail })
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={createForm.firstName}
                  onChange={(e) => {
                    const newFirstName = e.target.value
                    console.log('✏️ [FORM] First Name changed:', newFirstName)
                    setCreateForm({ ...createForm, firstName: newFirstName })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={createForm.lastName}
                  onChange={(e) => {
                    const newLastName = e.target.value
                    console.log('✏️ [FORM] Last Name changed:', newLastName)
                    setCreateForm({ ...createForm, lastName: newLastName })
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave empty to send invitation"
                value={createForm.password}
                onChange={(e) => {
                  const newPassword = e.target.value
                  console.log('🔒 [FORM] Password changed:', newPassword ? '[HIDDEN]' : 'empty')
                  setCreateForm({ ...createForm, password: newPassword })
                }}
              />
              <p className="text-xs text-muted-foreground">
                Min 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={createForm.role} 
                onValueChange={(value: 'admin' | 'user') => {
                  console.log('👤 [FORM] Role changed to:', value)
                  setCreateForm({ ...createForm, role: value })
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sendInvitation"
                checked={createForm.sendInvitation}
                onCheckedChange={(checked) => {
                  console.log('📧 [FORM] Send invitation changed to:', checked)
                  setCreateForm({ ...createForm, sendInvitation: checked })
                }}
              />
              <Label htmlFor="sendInvitation">Send invitation email</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              console.log('❌ [UI] Create User cancelled by user')
              setShowCreateDialog(false)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                console.log('🚀 [CREATE USER] Starting user creation process')
                console.log('📝 [CREATE USER] Form data:', {
                  email: createForm.email,
                  firstName: createForm.firstName,
                  lastName: createForm.lastName,
                  password: createForm.password ? '[HIDDEN]' : 'empty (will send invitation)',
                  role: createForm.role,
                  sendInvitation: createForm.sendInvitation
                })
                console.log('🔍 [CREATE USER] Form validation:', {
                  hasEmail: !!createForm.email,
                  hasFirstName: !!createForm.firstName,
                  hasLastName: !!createForm.lastName,
                  isValid: !!(createForm.email && createForm.firstName && createForm.lastName)
                })
                createUserMutation.mutate(createForm)
              }}
              disabled={createUserMutation.isPending || !createForm.email || !createForm.firstName || !createForm.lastName}
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Changing email will require re-verification
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editForm.role} 
                  onValueChange={(value: 'admin' | 'user') => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editForm.isActive}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active Status</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedUser && updateUserMutation.mutate({ 
                id: selectedUser.id, 
                data: editForm 
              })}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={resetPasswordForm.newPassword}
                onChange={(e) => setResetPasswordForm({ newPassword: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Min 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedUser && resetPasswordMutation.mutate({ 
                id: selectedUser.id, 
                newPassword: resetPasswordForm.newPassword 
              })}
              disabled={resetPasswordMutation.isPending || !resetPasswordForm.newPassword}
            >
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm.user} onOpenChange={() => setDeleteConfirm({ user: null, permanent: false })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {deleteConfirm.permanent ? 'Permanently Delete User?' : 'Delete User?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm.permanent ? (
                <>
                  This action <strong>CANNOT be undone</strong>. This will permanently delete the user <strong>{deleteConfirm.user?.email}</strong> and remove all associated data from the database.
                </>
              ) : (
                <>
                  Are you sure you want to delete <strong>{deleteConfirm.user?.email}</strong>? This user can be restored later from the deleted users list.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteConfirm.permanent ? 'Delete Permanently' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser && !showEditDialog} onOpenChange={() => { setSelectedUser(null); setUserStats(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information and statistics</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.profile?.profileImageUrl} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.firstName, selectedUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {`${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || 'User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                      {selectedUser.role}
                    </Badge>
                    <Badge variant={selectedUser.status === 'active' ? 'default' : 'secondary'}>
                      {selectedUser.status}
                    </Badge>
                    {selectedUser.isVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              {selectedUser.profile && (
                <div>
                  <Label className="text-base font-semibold">Profile Information</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    {selectedUser.profile.age && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Age</Label>
                        <p className="text-sm font-medium">{selectedUser.profile.age} years</p>
                      </div>
                    )}
                    {selectedUser.profile.gender && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Gender</Label>
                        <p className="text-sm font-medium capitalize">{selectedUser.profile.gender}</p>
                      </div>
                    )}
                    {selectedUser.profile.weight && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Weight</Label>
                        <p className="text-sm font-medium">
                          {typeof selectedUser.profile.weight === 'number' 
                            ? `${selectedUser.profile.weight} kg` 
                            : `${selectedUser.profile.weight} kg`}
                        </p>
                      </div>
                    )}
                    {selectedUser.profile.height && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Height</Label>
                        <p className="text-sm font-medium">
                          {typeof selectedUser.profile.height === 'number' 
                            ? `${selectedUser.profile.height} cm` 
                            : `${selectedUser.profile.height} cm`}
                        </p>
                      </div>
                    )}
                    {selectedUser.profile.bmi && (
                      <div>
                        <Label className="text-xs text-muted-foreground">BMI</Label>
                        <p className="text-sm font-medium">
                          {typeof selectedUser.profile.bmi === 'number' 
                            ? selectedUser.profile.bmi.toFixed(1) 
                            : selectedUser.profile.bmi}
                        </p>
                      </div>
                    )}
                    {selectedUser.goal && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Goal</Label>
                        <p className="text-sm font-medium capitalize">{selectedUser.goal.replace('_', ' ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              {userStats && (
                <div>
                  <Label className="text-base font-semibold">Activity Statistics</Label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <Card>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm">Workouts</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{userStats.totalWorkouts || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm">Current Streak</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{userStats.currentStreak || 0} days</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div>
                <Label className="text-base font-semibold">Account Information</Label>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Provider</Label>
                    <p className="text-sm font-medium capitalize">{selectedUser.provider}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Joined</Label>
                    <p className="text-sm font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedUser(null); setUserStats(null); }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
