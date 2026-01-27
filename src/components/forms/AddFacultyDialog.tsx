import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useDepartments, useCreateFaculty } from '@/hooks/useData';

export function AddFacultyDialog() {
  const [open, setOpen] = useState(false);
  const { data: departments = [] } = useDepartments();
  const createFaculty = useCreateFaculty();

  const [form, setForm] = useState({
    name: '',
    email: '',
    department_id: '',
    max_hours_per_week: 18,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFaculty.mutate({
      ...form,
      email: form.email || null,
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ name: '', email: '', department_id: '', max_hours_per_week: 18 });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Faculty
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Faculty Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Dr. John Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="john.smith@university.edu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={form.department_id} onValueChange={v => setForm(f => ({ ...f, department_id: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_hours">Max Hours/Week</Label>
            <Select value={form.max_hours_per_week.toString()} onValueChange={v => setForm(f => ({ ...f, max_hours_per_week: parseInt(v) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[12, 15, 18, 20, 24].map(h => (
                  <SelectItem key={h} value={h.toString()}>{h} hours</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFaculty.isPending}>
              {createFaculty.isPending ? 'Adding...' : 'Add Faculty'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
