'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { 
  Search, 
  Dumbbell, 
  Filter, 
  Download,
  RefreshCw,
  BarChart3,
  Loader2,
  Eye,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'

const BODY_PARTS = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist']
const EQUIPMENTS = ['assisted', 'band', 'barbell', 'body weight', 'cable', 'dumbbell', 'kettlebell', 'leverage machine', 'medicine ball', 'resistance band', 'smith machine', 'stability ball']

export default function ExercisesPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [bodyPart, setBodyPart] = useState<string>('')
  const [equipment, setEquipment] = useState<string>('')
  const [seedDialogOpen, setSeedDialogOpen] = useState(false)
  const [seedLimit, setSeedLimit] = useState('100')
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  
  // Fetch exercises
  const { data: exercisesData, isLoading, error, refetch } = useQuery({
    queryKey: ['exercises', page, limit, search, bodyPart, equipment],
    queryFn: () => exercisesApi.getExercises({
      page,
      limit,
      search: search || undefined,
      bodyPart: bodyPart && bodyPart !== 'all' ? bodyPart : undefined,
      equipment: equipment && equipment !== 'all' ? equipment : undefined,
    }),
    retry: 1,
  })

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ['exercise-stats'],
    queryFn: () => exercisesApi.getExerciseStats(),
    retry: 1,
  })

  // Seed mutation
  const seedMutation = useMutation({
    mutationFn: (limit: number) => exercisesApi.seedExercises(limit),
    onSuccess: () => {
      toast.success('Exercise seeding started successfully!')
      setSeedDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['exercises'] })
      queryClient.invalidateQueries({ queryKey: ['exercise-stats'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to start seeding')
    },
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleSeed = () => {
    const limit = parseInt(seedLimit)
    if (isNaN(limit) || limit < 1) {
      toast.error('Please enter a valid number')
      return
    }
    seedMutation.mutate(limit)
  }

  const exercises = exercisesData?.data?.exercises || []
  const pagination = exercisesData?.data?.pagination
  const stats = statsData?.data

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats?.totalExercises || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Body Parts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.bodyParts ? Object.keys(stats.bodyParts).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Different muscle groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Types</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.equipment ? Object.keys(stats.equipment).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Available equipment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Muscles</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.targetMuscles ? Object.keys(stats.targetMuscles).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Muscle targets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exercise Management</CardTitle>
              <CardDescription>
                Manage and seed exercises from ExerciseDB API
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Dialog open={seedDialogOpen} onOpenChange={setSeedDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Seed Exercises
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Seed Exercises from ExerciseDB</DialogTitle>
                    <DialogDescription>
                      Import exercises from ExerciseDB API. This may take a few minutes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="seedLimit">Number of exercises to seed</Label>
                      <Input
                        id="seedLimit"
                        type="number"
                        placeholder="100"
                        value={seedLimit}
                        onChange={(e) => setSeedLimit(e.target.value)}
                        min="1"
                        max="1500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to seed all available exercises
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSeedDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSeed} disabled={seedMutation.isPending}>
                      {seedMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Seeding...
                        </>
                      ) : (
                        'Start Seeding'
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
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={bodyPart} onValueChange={(value) => { setBodyPart(value); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Body Part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Parts</SelectItem>
                {BODY_PARTS.map((bp) => (
                  <SelectItem key={bp} value={bp}>
                    {bp.charAt(0).toUpperCase() + bp.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={equipment} onValueChange={(value) => { setEquipment(value); setPage(1); }}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                {EQUIPMENTS.map((eq) => (
                  <SelectItem key={eq} value={eq}>
                    {eq.charAt(0).toUpperCase() + eq.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load exercises. Please check your backend connection.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No exercises found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or seed exercises from ExerciseDB
              </p>
              <Button onClick={() => setSeedDialogOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Seed Exercises
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Body Parts</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Target Muscles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exercises.map((exercise: any) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {exercise.imageUrl && (
                              <img 
                                src={exercise.imageUrl} 
                                alt={exercise.name}
                                className="w-10 h-10 rounded object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            )}
                            <span className="line-clamp-2">{exercise.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {exercise.exerciseType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {exercise.bodyParts?.slice(0, 2).map((bp: string) => (
                              <Badge key={bp} variant="outline" className="text-xs">
                                {bp}
                              </Badge>
                            ))}
                            {exercise.bodyParts?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{exercise.bodyParts.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {exercise.equipments?.slice(0, 2).map((eq: string) => (
                              <Badge key={eq} variant="outline" className="text-xs">
                                {eq}
                              </Badge>
                            ))}
                            {exercise.equipments?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{exercise.equipments.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {exercise.targetMuscles?.slice(0, 2).map((tm: string) => (
                              <Badge key={tm} variant="outline" className="text-xs">
                                {tm}
                              </Badge>
                            ))}
                            {exercise.targetMuscles?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{exercise.targetMuscles.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedExercise(exercise)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
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
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} exercises
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
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      {pagination.totalPages > 5 && <span className="px-2">...</span>}
                    </div>
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

      {/* Exercise Detail Dialog */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>Exercise details and instructions</DialogDescription>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-4">
              {selectedExercise.imageUrl && (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={selectedExercise.imageUrl} 
                    alt={selectedExercise.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge className="mt-1">{selectedExercise.exerciseType}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Body Parts</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedExercise.bodyParts?.map((bp: string) => (
                      <Badge key={bp} variant="outline">{bp}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Equipment</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedExercise.equipments?.map((eq: string) => (
                      <Badge key={eq} variant="outline">{eq}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Target Muscles</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedExercise.targetMuscles?.map((tm: string) => (
                      <Badge key={tm} variant="outline">{tm}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {selectedExercise.overview && (
                <div>
                  <Label className="text-sm font-medium">Overview</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedExercise.overview}</p>
                </div>
              )}

              {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Instructions</Label>
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    {selectedExercise.instructions.map((inst: any, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {inst.text || inst}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tips</Label>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {selectedExercise.tips.map((tip: any, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {tip.text || tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedExercise(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
