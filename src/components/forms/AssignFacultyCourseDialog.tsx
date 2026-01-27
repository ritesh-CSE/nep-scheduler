import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'lucide-react';
import { useFaculty, useCourses, useCreateFacultyCourse } from '@/hooks/useData';

export function AssignFacultyCourseDialog() {
  const [open, setOpen] = useState(false);
  const { data: faculty = [] } = useFaculty();
  const { data: courses = [] } = useCourses();
  const createFacultyCourse = useCreateFacultyCourse();

  const [form, setForm] = useState({
    faculty_id: '',
    course_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFacultyCourse.mutate(form, {
      onSuccess: () => {
        setOpen(false);
        setForm({ faculty_id: '', course_id: '' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link className="h-4 w-4 mr-2" />
          Assign Course
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Faculty to Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faculty">Faculty Member</Label>
            <Select value={form.faculty_id} onValueChange={v => setForm(f => ({ ...f, faculty_id: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent>
                {faculty.map(f => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name} ({f.department?.code || 'N/A'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={form.course_id} onValueChange={v => setForm(f => ({ ...f, course_id: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFacultyCourse.isPending}>
              {createFacultyCourse.isPending ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
