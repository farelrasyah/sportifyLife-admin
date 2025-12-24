'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Copy } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body Blast',
    description: 'Intensive upper body workout for strength building',
    difficulty: 'intermediate',
    duration: 45,
    exerciseCount: 8,
    category: 'Strength',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Full Body HIIT',
    description: 'High-intensity interval training for full body',
    difficulty: 'advanced',
    duration: 30,
    exerciseCount: 10,
    category: 'Cardio',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Beginner Core',
    description: 'Core strengthening exercises for beginners',
    difficulty: 'beginner',
    duration: 20,
    exerciseCount: 6,
    category: 'Core',
    createdAt: '2024-01-13',
  },
]

export default function WorkoutsPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workout Management</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage workout templates for users
          </p>
        </div>
        <Link href="/workouts/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Workouts</CardDescription>
            <CardTitle className="text-3xl">{mockWorkouts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg. Duration</CardDescription>
            <CardTitle className="text-3xl">32 min</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workouts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workouts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockWorkouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{workout.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        workout.difficulty === 'beginner' ? 'default' :
                        workout.difficulty === 'intermediate' ? 'secondary' :
                        'destructive'
                      }
                      className="capitalize"
                    >
                      {workout.difficulty}
                    </Badge>
                    <Badge variant="outline">{workout.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {workout.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{workout.duration} minutes</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Exercises</p>
                  <p className="font-medium">{workout.exerciseCount} exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t">
                <Link href={`/workouts/${workout.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
