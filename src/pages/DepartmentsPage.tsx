import { MainLayout } from '@/components/layout/MainLayout';
import { AddDepartmentDialog } from '@/components/forms/AddDepartmentDialog';
import { useDepartments, useDeleteDepartment, useCourses, useFaculty } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Building2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const DepartmentsPage = () => {
  const { data: departments = [], isLoading } = useDepartments();
  const { data: courses = [] } = useCourses();
  const { data: faculty = [] } = useFaculty();
  const deleteDepartment = useDeleteDepartment();

  // Count courses and faculty per department
  const getCounts = (deptId: string) => ({
    courses: courses.filter(c => c.department_id === deptId).length,
    faculty: faculty.filter(f => f.department_id === deptId).length,
  });

  return (
    <MainLayout title="Departments" subtitle="Manage academic departments">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {departments.length} department{departments.length !== 1 ? 's' : ''} registered
        </p>
        <AddDepartmentDialog />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Department Name</TableHead>
              <TableHead className="text-center">Courses</TableHead>
              <TableHead className="text-center">Faculty</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading departments...
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No departments added yet</p>
                  <p className="text-sm text-muted-foreground/70">Click "Add Department" to get started</p>
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept, index) => {
                const counts = getCounts(dept.id);
                return (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded font-mono text-sm">
                        {dept.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell className="text-center">{counts.courses}</TableCell>
                    <TableCell className="text-center">{counts.faculty}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Department?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {dept.name} and all associated courses and faculty.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDepartment.mutate(dept.id)}
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

export default DepartmentsPage;
