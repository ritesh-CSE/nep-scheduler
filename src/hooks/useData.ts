import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  Department, Course, Faculty, Room, Student, 
  FacultyAvailability, FacultyCourse, StudentEnrollment, TimetableSlot,
  CourseType
} from '@/types/database';
import { toast } from 'sonner';

// Helper to cast course_type from database
const mapCourse = (row: any): Course => ({
  ...row,
  course_type: row.course_type as CourseType,
});

// ============ DEPARTMENTS ============
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Department[];
    }
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dept: { name: string; code: string }) => {
      const { data, error } = await supabase
        .from('departments')
        .insert(dept)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
    },
    onError: (error) => toast.error(`Failed to create department: ${error.message}`)
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted');
    },
    onError: (error) => toast.error(`Failed to delete: ${error.message}`)
  });
}

// ============ COURSES ============
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, department:departments(*)')
        .order('code');
      if (error) throw error;
      return (data || []).map(mapCourse);
    }
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (course: Omit<Course, 'id' | 'created_at' | 'department'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error) => toast.error(`Failed to create course: ${error.message}`)
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted');
    },
    onError: (error) => toast.error(`Failed to delete: ${error.message}`)
  });
}

// ============ FACULTY ============
export function useFaculty() {
  return useQuery({
    queryKey: ['faculty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select('*, department:departments(*)')
        .order('name');
      if (error) throw error;
      return data as Faculty[];
    }
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faculty: Omit<Faculty, 'id' | 'created_at' | 'department'>) => {
      const { data, error } = await supabase
        .from('faculty')
        .insert(faculty)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty member added successfully');
    },
    onError: (error) => toast.error(`Failed to add faculty: ${error.message}`)
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty member removed');
    },
    onError: (error) => toast.error(`Failed to delete: ${error.message}`)
  });
}

// ============ FACULTY AVAILABILITY ============
export function useFacultyAvailability() {
  return useQuery({
    queryKey: ['faculty_availability'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty_availability')
        .select('*');
      if (error) throw error;
      return data as FacultyAvailability[];
    }
  });
}

export function useCreateFacultyAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (avail: Omit<FacultyAvailability, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('faculty_availability')
        .insert(avail)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty_availability'] });
      toast.success('Availability added');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`)
  });
}

// ============ FACULTY COURSES ============
export function useFacultyCourses() {
  return useQuery({
    queryKey: ['faculty_courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty_courses')
        .select('*, faculty:faculty(*), course:courses(*)');
      if (error) throw error;
      return data as FacultyCourse[];
    }
  });
}

export function useCreateFacultyCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fc: { faculty_id: string; course_id: string }) => {
      const { data, error } = await supabase
        .from('faculty_courses')
        .insert(fc)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty_courses'] });
      toast.success('Faculty assigned to course');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`)
  });
}

export function useDeleteFacultyCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faculty_courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty_courses'] });
      toast.success('Assignment removed');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`)
  });
}

// ============ ROOMS ============
export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as Room[];
    }
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (room: Omit<Room, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room added successfully');
    },
    onError: (error) => toast.error(`Failed to add room: ${error.message}`)
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room removed');
    },
    onError: (error) => toast.error(`Failed to delete: ${error.message}`)
  });
}

// ============ STUDENTS ============
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*, department:departments(*)')
        .order('roll_number');
      if (error) throw error;
      return data as Student[];
    }
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student: Omit<Student, 'id' | 'created_at' | 'department'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
    },
    onError: (error) => toast.error(`Failed to add student: ${error.message}`)
  });
}

// ============ STUDENT ENROLLMENTS ============
export function useStudentEnrollments() {
  return useQuery({
    queryKey: ['student_enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_enrollments')
        .select('*, student:students(*), course:courses(*)');
      if (error) throw error;
      return data as StudentEnrollment[];
    }
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (enrollment: Omit<StudentEnrollment, 'id' | 'created_at' | 'student' | 'course'>) => {
      const { data, error } = await supabase
        .from('student_enrollments')
        .insert(enrollment)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student_enrollments'] });
      toast.success('Enrollment added');
    },
    onError: (error) => toast.error(`Failed: ${error.message}`)
  });
}

// ============ TIMETABLE SLOTS ============
export function useTimetableSlots(academicYear?: string, semester?: number) {
  return useQuery({
    queryKey: ['timetable_slots', academicYear, semester],
    queryFn: async () => {
      let query = supabase
        .from('timetable_slots')
        .select('*, course:courses(*, department:departments(*)), faculty:faculty(*), room:rooms(*)');
      
      if (academicYear) query = query.eq('academic_year', academicYear);
      if (semester) query = query.eq('semester', semester);
      
      const { data, error } = await query.order('day_of_week').order('start_hour');
      if (error) throw error;
      
      return (data || []).map(slot => ({
        ...slot,
        course: slot.course ? mapCourse(slot.course) : undefined
      })) as TimetableSlot[];
    }
  });
}

export function useSaveTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ slots, academicYear, semester }: { 
      slots: Omit<TimetableSlot, 'id' | 'created_at'>[], 
      academicYear: string, 
      semester: number 
    }) => {
      // First delete existing slots for this year/semester
      const { error: deleteError } = await supabase
        .from('timetable_slots')
        .delete()
        .eq('academic_year', academicYear)
        .eq('semester', semester);
      if (deleteError) throw deleteError;

      // Then insert new slots
      if (slots.length > 0) {
        const { error: insertError } = await supabase
          .from('timetable_slots')
          .insert(slots);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable_slots'] });
      toast.success('Timetable saved successfully');
    },
    onError: (error) => toast.error(`Failed to save timetable: ${error.message}`)
  });
}

export function useClearTimetable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ academicYear, semester }: { academicYear: string; semester: number }) => {
      const { error } = await supabase
        .from('timetable_slots')
        .delete()
        .eq('academic_year', academicYear)
        .eq('semester', semester);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable_slots'] });
      toast.success('Timetable cleared');
    },
    onError: (error) => toast.error(`Failed to clear: ${error.message}`)
  });
}
