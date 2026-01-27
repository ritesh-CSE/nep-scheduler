import { MainLayout } from '@/components/layout/MainLayout';
import { AddRoomDialog } from '@/components/forms/AddRoomDialog';
import { useRooms, useDeleteRoom } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, DoorOpen, FlaskConical, Building } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const RoomsPage = () => {
  const { data: rooms = [], isLoading } = useRooms();
  const deleteRoom = useDeleteRoom();

  const classrooms = rooms.filter(r => !r.is_lab);
  const labs = rooms.filter(r => r.is_lab);

  return (
    <MainLayout title="Rooms & Labs" subtitle="Manage classrooms and laboratory facilities">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{classrooms.length} Classrooms</span>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-secondary" />
            <span className="text-muted-foreground">{labs.length} Labs</span>
          </div>
        </div>
        <AddRoomDialog />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Room Name</TableHead>
              <TableHead>Building</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading rooms...
                </TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <DoorOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No rooms added yet</p>
                  <p className="text-sm text-muted-foreground/70">Add classrooms and labs for timetable generation</p>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room, index) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell className="text-muted-foreground">{room.building || '—'}</TableCell>
                  <TableCell>
                    {room.is_lab ? (
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                        <FlaskConical className="h-3 w-3 mr-1" />
                        Laboratory
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Building className="h-3 w-3 mr-1" />
                        Classroom
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium">{room.capacity}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Room?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {room.name}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteRoom.mutate(room.id)}
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

export default RoomsPage;
