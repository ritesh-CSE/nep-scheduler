import { MainLayout } from '@/components/layout/MainLayout';
import { AddCourseDialog } from '@/components/forms/AddCourseDialog';
import { useCourses, useDeleteCourse } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, BookOpen, FlaskConical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { COURSE_TYPE_INFO } from '@/types/database';
import { cn } from '@/lib/utils';

const CoursesPage = () => {
  const { data: courses = [], isLoading } = useCourses();
  const deleteCourse = useDeleteCourse();

  const getCourseTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'MAJOR': return 'bg-major text-white';
      case 'MINOR': return 'bg-minor text-white';
      case 'SEC': return 'bg-sec text-white';
      case 'AEC': return 'bg-aec text-foreground';
      case 'VAC': return 'bg-vac text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <MainLayout title="Courses" subtitle="NEP 2020 compliant course management">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {courses.length} course{courses.length !== 1 ? 's' : ''} registered
        </p>
        <AddCourseDialog />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead className="text-center">Hrs/Wk</TableHead>
              <TableHead className="text-center">Sem</TableHead>
              <TableHead className="text-center">Lab</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  Loading courses...
                </TableCell>
              </TableRow>
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No courses added yet</p>
                  <p className="text-sm text-muted-foreground/70">Add departments first, then create courses</p>
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">{course.code}</span>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{course.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {course.department?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs', getCourseTypeBadgeClass(course.course_type))}>
                      {COURSE_TYPE_INFO[course.course_type]?.label || course.course_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">{course.credits}</TableCell>
                  <TableCell className="text-center">{course.hours_per_week}</TableCell>
                  <TableCell className="text-center">{course.semester}</TableCell>
                  <TableCell className="text-center">
                    {course.requires_lab && <FlaskConical className="h-4 w-4 mx-auto text-secondary" />}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {course.code} - {course.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCourse.mutate(course.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default CoursesPage;
