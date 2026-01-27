import { MainLayout } from '@/components/layout/MainLayout';
import { AddFacultyDialog } from '@/components/forms/AddFacultyDialog';
import { AssignFacultyCourseDialog } from '@/components/forms/AssignFacultyCourseDialog';
import { useFaculty, useDeleteFaculty, useFacultyCourses, useDeleteFacultyCourse } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, X } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const FacultyPage = () => {
  const { data: faculty = [], isLoading } = useFaculty();
  const { data: facultyCourses = [] } = useFacultyCourses();
  const deleteFaculty = useDeleteFaculty();
  const deleteFacultyCourse = useDeleteFacultyCourse();

  const getAssignedCourses = (facultyId: string) => {
    return facultyCourses.filter(fc => fc.faculty_id === facultyId);
  };

  return (
    <MainLayout title="Faculty" subtitle="Manage teaching staff and course assignments">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {faculty.length} faculty member{faculty.length !== 1 ? 's' : ''} registered
        </p>
        <div className="flex gap-2">
          <AssignFacultyCourseDialog />
          <AddFacultyDialog />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Max Hrs/Wk</TableHead>
              <TableHead>Assigned Courses</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading faculty...
                </TableCell>
              </TableRow>
            ) : faculty.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No faculty added yet</p>
                  <p className="text-sm text-muted-foreground/70">Add departments first, then add faculty members</p>
                </TableCell>
              </TableRow>
            ) : (
              faculty.map((fac, index) => {
                const assignments = getAssignedCourses(fac.id);
                return (
                  <TableRow key={fac.id}>
                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{fac.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {fac.department?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fac.email || '—'}
                    </TableCell>
                    <TableCell className="text-center">{fac.max_hours_per_week}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {assignments.length === 0 ? (
                          <span className="text-sm text-muted-foreground">No courses assigned</span>
                        ) : (
                          assignments.map(a => (
                            <Badge key={a.id} variant="secondary" className="text-xs flex items-center gap-1">
                              {a.course?.code || 'Unknown'}
                              <button
                                onClick={() => deleteFacultyCourse.mutate(a.id)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))
                        )}
                      </div>
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
                            <AlertDialogTitle>Delete Faculty Member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {fac.name} and their course assignments.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteFaculty.mutate(fac.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default FacultyPage;
