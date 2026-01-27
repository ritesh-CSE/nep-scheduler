import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';
import { useCreateRoom } from '@/hooks/useData';

export function AddRoomDialog() {
  const [open, setOpen] = useState(false);
  const createRoom = useCreateRoom();

  const [form, setForm] = useState({
    name: '',
    capacity: 40,
    is_lab: false,
    building: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom.mutate({
      ...form,
      building: form.building || null,
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ name: '', capacity: 40, is_lab: false, building: '' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Room / Lab</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name/Number</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Room 101 or CS Lab 1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Select value={form.capacity.toString()} onValueChange={v => setForm(f => ({ ...f, capacity: parseInt(v) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[20, 30, 40, 50, 60, 80, 100, 120, 150, 200].map(c => (
                    <SelectItem key={c} value={c.toString()}>{c} seats</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">Building (Optional)</Label>
              <Input
                id="building"
                value={form.building}
                onChange={e => setForm(f => ({ ...f, building: e.target.value }))}
                placeholder="Block A"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_lab"
              checked={form.is_lab}
              onCheckedChange={checked => setForm(f => ({ ...f, is_lab: checked === true }))}
            />
            <Label htmlFor="is_lab" className="text-sm font-normal">
              This is a Lab Room
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRoom.isPending}>
              {createRoom.isPending ? 'Adding...' : 'Add Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
