import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TimetableGrid, TimetableLegend } from '@/components/timetable/TimetableGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Trash2, AlertCircle, CheckCircle2, Calendar, BarChart3 } from 'lucide-react';
import { useCourses, useFaculty, useRooms, useFacultyAvailability, useFacultyCourses, useTimetableSlots, useSaveTimetable, useClearTimetable } from '@/hooks/useData';
import { generateTimetable, type SchedulerResult } from '@/lib/scheduler';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const TimetablePage = () => {
  const currentYear = new Date().getFullYear();
  const [academicYear, setAcademicYear] = useState(`${currentYear}-${currentYear + 1}`);
  const [semester, setSemester] = useState(1);
  const [generationResult, setGenerationResult] = useState<SchedulerResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: courses = [] } = useCourses();
  const { data: faculty = [] } = useFaculty();
  const { data: rooms = [] } = useRooms();
  const { data: facultyAvailability = [] } = useFacultyAvailability();
  const { data: facultyCourses = [] } = useFacultyCourses();
  const { data: timetableSlots = [], isLoading } = useTimetableSlots(academicYear, semester);
  const saveTimetable = useSaveTimetable();
  const clearTimetable = useClearTimetable();

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate processing time for visual feedback
    setTimeout(() => {
      const result = generateTimetable({
        courses,
        faculty,
        rooms,
        facultyAvailability,
        facultyCourses,
        semester,
        academicYear,
      });

      setGenerationResult(result);
      setIsGenerating(false);

      if (result.success) {
        toast.success(`Timetable generated successfully! ${result.slots.length} slots scheduled.`);
      } else if (result.slots.length > 0) {
        toast.warning(`Partial timetable generated with ${result.conflicts.length} conflicts.`);
      } else {
        toast.error('Could not generate timetable. Check conflicts below.');
      }
    }, 1000);
  };

  const handleSave = () => {
    if (!generationResult) return;
    saveTimetable.mutate({
      slots: generationResult.slots,
      academicYear,
      semester,
    }, {
      onSuccess: () => {
        setGenerationResult(null);
      }
    });
  };

  const handleClear = () => {
    clearTimetable.mutate({ academicYear, semester });
    setGenerationResult(null);
  };

  // Enrich generated slots with joined data for display
  const enrichedGeneratedSlots = generationResult?.slots.map((slot, index) => ({
    ...slot,
    id: `generated-${index}`,
    created_at: new Date().toISOString(),
    course: courses.find(c => c.id === slot.course_id),
    faculty: faculty.find(f => f.id === slot.faculty_id),
    room: rooms.find(r => r.id === slot.room_id),
  })) || null;

  const displaySlots = enrichedGeneratedSlots || timetableSlots;
  const hasUnsavedChanges = generationResult !== null;

  // Check readiness
  const semesterCourses = courses.filter(c => c.semester === semester);
  const assignedCourseIds = new Set(facultyCourses.map(fc => fc.course_id));
  const unassignedCourses = semesterCourses.filter(c => !assignedCourseIds.has(c.id));
  const isReady = semesterCourses.length > 0 && rooms.length > 0 && unassignedCourses.length === 0;

  return (
    <MainLayout title="Timetable" subtitle="Generate and view conflict-free schedules">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Academic Year:</span>
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2].map(offset => {
                const year = currentYear + offset;
                return (
                  <SelectItem key={year} value={`${year}-${year + 1}`}>
                    {year}-{year + 1}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Semester:</span>
          <Select value={semester.toString()} onValueChange={v => setSemester(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !isReady}
          className="bg-secondary hover:bg-secondary/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Timetable'}
        </Button>

        {hasUnsavedChanges && (
          <Button onClick={handleSave} disabled={saveTimetable.isPending}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {saveTimetable.isPending ? 'Saving...' : 'Save Timetable'}
          </Button>
        )}

        {(displaySlots.length > 0 || timetableSlots.length > 0) && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Timetable?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all scheduled slots for Semester {semester}, {academicYear}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear} className="bg-destructive">
                  Clear
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Readiness Check */}
      {!isReady && (
        <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Setup Required</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                {semesterCourses.length === 0 && (
                  <li>• No courses found for Semester {semester}</li>
                )}
                {rooms.length === 0 && (
                  <li>• No rooms/labs added</li>
                )}
                {unassignedCourses.length > 0 && (
                  <li>• {unassignedCourses.length} course(s) have no faculty assigned: {unassignedCourses.map(c => c.code).join(', ')}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Generation Stats */}
      {generationResult && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {generationResult.stats.scheduledCourses}/{generationResult.stats.totalCourses}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generationResult.stats.totalSlots}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Room Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generationResult.stats.roomUtilization}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Load Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{generationResult.stats.facultyLoadBalance}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Conflicts */}
      {generationResult && generationResult.conflicts.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Scheduling Conflicts ({generationResult.conflicts.length})</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                {generationResult.conflicts.slice(0, 5).map((conflict, i) => (
                  <li key={i}>• {conflict}</li>
                ))}
                {generationResult.conflicts.length > 5 && (
                  <li className="text-muted-foreground/70">... and {generationResult.conflicts.length - 5} more</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <TimetableLegend />

      {/* Timetable Grid */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2 animate-pulse" />
              <p className="text-muted-foreground">Loading timetable...</p>
            </div>
          </div>
        ) : displaySlots.length === 0 ? (
          <div className="flex items-center justify-center py-12 border-2 border-dashed rounded-xl">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground font-medium">No Timetable Generated</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {isReady 
                  ? 'Click "Generate Timetable" to create a schedule'
                  : 'Complete the setup steps above first'
                }
              </p>
            </div>
          </div>
        ) : (
          <TimetableGrid slots={displaySlots as any} />
        )}
      </div>

      {/* Algorithm Info */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
        <h3 className="font-medium mb-2">Scheduling Algorithm</h3>
        <p className="text-sm text-muted-foreground">
          This system uses a Constraint Satisfaction Problem (CSP) approach with heuristics:
        </p>
        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
          <li>• <strong>Minimum Remaining Values (MRV)</strong>: Schedules most constrained courses first</li>
          <li>• <strong>Faculty workload balancing</strong>: Distributes hours evenly among faculty</li>
          <li>• <strong>Conflict prevention</strong>: No faculty, room, or student time conflicts</li>
          <li>• <strong>NEP 2020 compliance</strong>: Supports all course types (Major/Minor/SEC/AEC/VAC)</li>
        </ul>
      </div>
    </MainLayout>
  );
};

export default TimetablePage;
