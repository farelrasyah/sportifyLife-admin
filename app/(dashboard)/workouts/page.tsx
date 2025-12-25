'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workoutsApi, type CreateWorkoutDTO } from '@/lib/api/workouts'
import { exercisesApi } from '@/lib/api/exercises'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Activity, 
  Filter, 
  RefreshCw,
  Plus,
  Loader2,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { formatNumber } from '@/lib/utils'
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

const LEVELS = ['beginner', 'intermediate', 'advanced']
const CATEGORIES = ['strength', 'cardio', 'flexibility', 'balance', 'mixed']

export default function WorkoutsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [deleteWorkoutId, setDeleteWorkoutId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<CreateWorkoutDTO>({
    name: '',
    description: '',
    level: 'beginner',
    category: 'strength',
    exercises: []
  })
  
  // Fetch workouts
  const { data: workoutsData, isLoading, error, refetch } = useQuery({
    queryKey: ['workouts', page, limit, search, level, category],
    queryFn: () => workoutsApi.getWorkouts({
      page,
      limit,
      search: search || undefined,
      level: level && level !== 'all' ? level : undefined,
      category: category && category !== 'all' ? category : undefined,
    }),
    retry: 1,
  })

  // Fetch exercises for workout builder
  const { data: exercisesData } = useQuery({
    queryKey: ['exercises-for-workout'],
    queryFn: () => exercisesApi.getExercises({ limit: 100 }),
    enabled: createDialogOpen,
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateWorkoutDTO) => workoutsApi.createWorkout(data),
    onSuccess: () => {
      toast.success('Workout created successfully!')
      setCreateDialogOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create workout')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => workoutsApi.deleteWorkout(id),
    onSuccess: () => {
      toast.success('Workout deleted successfully!')
      setDeleteWorkoutId(null)
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete workout')
    },
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      level: 'beginner',
      category: 'strength',
      exercises: []
    })
  }

  const handleCreateWorkout = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }
    if (formData.exercises.length === 0) {
      toast.error('Please add at least one exercise')
      return
    }
    createMutation.mutate(formData)
  }

  const addExercise = (exerciseId: string) => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        exerciseId,
        order: prev.exercises.length + 1,
        sets: 3,
        reps: '10-12',
        restSeconds: 60
      }]
    }))
  }

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index).map((ex, i) => ({
        ...ex,
        order: i + 1
      }))
    }))
  }

  const workouts = workoutsData?.data?.workouts || []
  const pagination = workoutsData?.data?.pagination
  const availableExercises = exercisesData?.data?.exercises || []

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(pagination?.total || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Workout templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{CATEGORIES.length}</div>
            <p className="text-xs text-muted-foreground">
              Different types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difficulty Levels</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{LEVELS.length}</div>
            <p className="text-xs text-muted-foreground">
              Beginner to Advanced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workout Management</CardTitle>
              <CardDescription>
                Create and manage workout templates
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Workout</DialogTitle>
                    <DialogDescription>
                      Build a new workout template with exercises
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Workout Name *</Label>
                      <Input
                        id="name"
                        placeholder="Upper Body Blast"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Intense upper body workout focusing on chest, back, and arms"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="level">Difficulty Level</Label>
                        <Select 
                          value={formData.level} 
                          onValueChange={(value: any) => setFormData(prev => ({ ...prev, level: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LEVELS.map((lvl) => (
                              <SelectItem key={lvl} value={lvl}>
                                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Exercises ({formData.exercises.length})</Label>
                      {formData.exercises.length === 0 ? (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Add exercises to your workout
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="space-y-2">
                          {formData.exercises.map((ex, idx) => {
                            const exercise = availableExercises.find((e: any) => e.id === ex.exerciseId)
                            return (
                              <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{exercise?.name || 'Exercise'}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {ex.sets} sets × {ex.reps} reps, {ex.restSeconds}s rest
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExercise(idx)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                      
                      <Select onValueChange={(value) => addExercise(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add exercise..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableExercises
                            .filter((ex: any) => !formData.exercises.find(e => e.exerciseId === ex.id))
                            .map((ex: any) => (
                              <SelectItem key={ex.id} value={ex.id}>
                                {ex.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWorkout} disabled={createMutation.isPending}>
                      {createMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Workout'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                  placeholder="Search workouts..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={level} onValueChange={(value) => { setLevel(value); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {LEVELS.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(value) => { setCategory(value); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load workouts. Please check your backend connection.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No workouts found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first workout template
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workout
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Exercises</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workouts.map((workout: any) => (
                      <TableRow key={workout.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="line-clamp-1">{workout.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {workout.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            workout.level === 'beginner' ? 'secondary' :
                            workout.level === 'intermediate' ? 'default' : 'destructive'
                          }>
                            {workout.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {workout.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{workout.exercises?.length || 0} exercises</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(workout.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedWorkout(workout)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeleteWorkoutId(workout.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} workouts
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

      {/* Workout Detail Dialog */}
      <Dialog open={!!selectedWorkout} onOpenChange={() => setSelectedWorkout(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>Workout details and exercises</DialogDescription>
          </DialogHeader>
          {selectedWorkout && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Level</Label>
                  <Badge className="mt-1">{selectedWorkout.level}</Badge>
                </div>
                <div>
                  <Label>Category</Label>
                  <Badge variant="outline" className="mt-1">{selectedWorkout.category}</Badge>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedWorkout.description}</p>
              </div>
              <div>
                <Label>Exercises ({selectedWorkout.exercises?.length || 0})</Label>
                <div className="space-y-2 mt-2">
                  {selectedWorkout.exercises?.map((ex: any, idx: number) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{ex.exerciseName || 'Exercise'}</p>
                          <p className="text-sm text-muted-foreground">
                            {ex.sets} sets × {ex.reps || `${ex.durationSeconds}s`}
                            {ex.restSeconds && ` • ${ex.restSeconds}s rest`}
                          </p>
                        </div>
                        <Badge variant="outline">{idx + 1}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedWorkout(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteWorkoutId} onOpenChange={() => setDeleteWorkoutId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workout template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteWorkoutId && deleteMutation.mutate(deleteWorkoutId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
