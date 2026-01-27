-- NEP 2020 Adaptive Timetable Scheduling System Database Schema

-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course types enum for NEP 2020 compliance
CREATE TYPE public.course_type AS ENUM ('MAJOR', 'MINOR', 'SEC', 'AEC', 'VAC');

-- Courses table with NEP 2020 course types
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  course_type public.course_type NOT NULL DEFAULT 'MAJOR',
  credits INTEGER NOT NULL CHECK (credits >= 1 AND credits <= 6),
  hours_per_week INTEGER NOT NULL CHECK (hours_per_week >= 1 AND hours_per_week <= 8),
  requires_lab BOOLEAN NOT NULL DEFAULT false,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculty table with workload tracking
CREATE TABLE public.faculty (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  max_hours_per_week INTEGER NOT NULL DEFAULT 18,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculty availability (days and time slots)
CREATE TABLE public.faculty_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4), -- 0=Monday, 4=Friday
  start_hour INTEGER NOT NULL CHECK (start_hour >= 8 AND start_hour <= 17),
  end_hour INTEGER NOT NULL CHECK (end_hour >= 9 AND end_hour <= 18),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_hours CHECK (end_hour > start_hour)
);

-- Faculty-Course assignments
CREATE TABLE public.faculty_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(faculty_id, course_id)
);

-- Rooms table (classrooms and labs)
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER NOT NULL CHECK (capacity >= 1),
  is_lab BOOLEAN NOT NULL DEFAULT false,
  building TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Student course enrollments (for elective selection across departments)
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, academic_year)
);

-- Timetable slots - the generated schedule
CREATE TABLE public.timetable_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 4),
  start_hour INTEGER NOT NULL CHECK (start_hour >= 8 AND start_hour <= 17),
  duration INTEGER NOT NULL DEFAULT 1 CHECK (duration >= 1 AND duration <= 3),
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 8),
  section TEXT,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Prevent conflicts: same room, same time
  UNIQUE(room_id, day_of_week, start_hour, academic_year),
  -- Prevent conflicts: same faculty, same time
  UNIQUE(faculty_id, day_of_week, start_hour, academic_year)
);

-- Enable Row Level Security on all tables (public read for admin dashboard)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;

-- Public read policies for all tables (admin system - no auth required for demo)
CREATE POLICY "Public read access" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.departments FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.departments FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.courses FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.courses FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.faculty FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.faculty FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.faculty_availability FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.faculty_availability FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.faculty_availability FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.faculty_availability FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.faculty_courses FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.faculty_courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.faculty_courses FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.faculty_courses FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.rooms FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.rooms FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.students FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.student_enrollments FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.student_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.student_enrollments FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.student_enrollments FOR DELETE USING (true);

CREATE POLICY "Public read access" ON public.timetable_slots FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.timetable_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.timetable_slots FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON public.timetable_slots FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_courses_department ON public.courses(department_id);
CREATE INDEX idx_faculty_department ON public.faculty(department_id);
CREATE INDEX idx_timetable_semester ON public.timetable_slots(semester, academic_year);
CREATE INDEX idx_timetable_day ON public.timetable_slots(day_of_week, start_hour);
CREATE INDEX idx_student_enrollments_student ON public.student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_course ON public.student_enrollments(course_id);