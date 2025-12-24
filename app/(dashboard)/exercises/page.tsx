'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/components/common/data-table'
import { Plus, Search, Filter, Download, RefreshCw } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import type { Exercise } from '@/types'

// Mock data - replace with actual API call
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-up',
    bodyPart: 'chest',
    equipment: 'body weight',
    target: 'pectorals',
    difficulty: 'beginner',
    instructions: ['Get into plank position', 'Lower body', 'Push back up'],
    gifUrl: 'https://example.com/pushup.gif',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Squat',
    bodyPart: 'upper legs',
    equipment: 'body weight',
    target: 'quadriceps',
    difficulty: 'beginner',
    instructions: ['Stand with feet shoulder-width', 'Lower down', 'Stand back up'],
    gifUrl: 'https://example.com/squat.gif',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const columns: ColumnDef<Exercise>[] = [
  {
    accessorKey: 'name',
    header: 'Exercise Name',
    cell: ({ row }) => (
      <Link href={`/exercises/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: 'bodyPart',
    header: 'Body Part',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.bodyPart}
      </Badge>
    ),
  },
  {
    accessorKey: 'target',
    header: 'Target Muscle',
    cell: ({ row }) => (
      <span className="capitalize">{row.original.target}</span>
    ),
  },
  {
    accessorKey: 'equipment',
    header: 'Equipment',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.equipment}
      </Badge>
    ),
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
    cell: ({ row }) => {
      const difficulty = row.original.difficulty
      const variant = 
        difficulty === 'beginner' ? 'default' :
        difficulty === 'intermediate' ? 'secondary' :
        'destructive'
      return (
        <Badge variant={variant} className="capitalize">
          {difficulty}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/exercises/${row.original.id}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      </div>
    ),
  },
]

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [bodyPart, setBodyPart] = useState('')
  const [equipment, setEquipment] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exercise Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your exercise library with {mockExercises.length} exercises
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/exercises/seeding">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Seed Exercises
            </Button>
          </Link>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Exercises</CardDescription>
            <CardTitle className="text-3xl">{mockExercises.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Body Parts</CardDescription>
            <CardTitle className="text-3xl">10</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Equipment Types</CardDescription>
            <CardTitle className="text-3xl">28</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Last Seeded</CardDescription>
            <CardTitle className="text-lg">2 days ago</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={bodyPart} onValueChange={setBodyPart}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Body Part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Body Parts</SelectItem>
                <SelectItem value="chest">Chest</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="arms">Arms</SelectItem>
              </SelectContent>
            </Select>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="body weight">Body Weight</SelectItem>
                <SelectItem value="dumbbell">Dumbbell</SelectItem>
                <SelectItem value="barbell">Barbell</SelectItem>
                <SelectItem value="machine">Machine</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={mockExercises} />
        </CardContent>
      </Card>
    </div>
  )
}
