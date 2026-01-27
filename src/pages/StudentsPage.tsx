import { MainLayout } from '@/components/layout/MainLayout';
import { AddStudentDialog } from '@/components/forms/AddStudentDialog';
import { useStudents } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap } from 'lucide-react';

const StudentsPage = () => {
  const { data: students = [], isLoading } = useStudents();

  return (
    <MainLayout title="Students" subtitle="Manage student enrollments and elective selections">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {students.length} student{students.length !== 1 ? 's' : ''} enrolled
        </p>
        <AddStudentDialog />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-center">Semester</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No students added yet</p>
                  <p className="text-sm text-muted-foreground/70">Students can select electives across departments per NEP 2020</p>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-medium">{student.roll_number}</span>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.department?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                      Sem {student.semester}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* NEP 2020 Info */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
        <h3 className="font-medium mb-2">NEP 2020 Elective Selection</h3>
        <p className="text-sm text-muted-foreground">
          Under NEP 2020, students can choose electives from any department, enabling truly 
          multidisciplinary education. The timetable system ensures no conflicts when students 
          enroll in courses across departments.
        </p>
      </div>
    </MainLayout>
  );
};

export default StudentsPage;
