// NEP 2020 Timetable System - Type Definitions

export type CourseType = 'MAJOR' | 'MINOR' | 'SEC' | 'AEC' | 'VAC';

export interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department_id: string;
  course_type: CourseType;
  credits: number;
  hours_per_week: number;
  requires_lab: boolean;
  semester: number;
  created_at: string;
  // Joined data
  department?: Department;
}

export interface Faculty {
  id: string;
  name: string;
  email: string | null;
  department_id: string;
  max_hours_per_week: number;
  created_at: string;
  // Joined data
  department?: Department;
}

export interface FacultyAvailability {
  id: string;
  faculty_id: string;
  day_of_week: number; // 0=Monday, 4=Friday
  start_hour: number;
  end_hour: number;
  created_at: string;
}

export interface FacultyCourse {
  id: string;
  faculty_id: string;
  course_id: string;
  created_at: string;
  // Joined data
  faculty?: Faculty;
  course?: Course;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  is_lab: boolean;
  building: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  roll_number: string;
  department_id: string;
  semester: number;
  created_at: string;
  // Joined data
  department?: Department;
}

export interface StudentEnrollment {
  id: string;
  student_id: string;
  course_id: string;
  academic_year: string;
  created_at: string;
  // Joined data
  student?: Student;
  course?: Course;
}

export interface TimetableSlot {
  id: string;
  course_id: string;
  faculty_id: string;
  room_id: string;
  day_of_week: number;
  start_hour: number;
  duration: number;
  semester: number;
  section: string | null;
  academic_year: string;
  created_at: string;
  // Joined data
  course?: Course;
  faculty?: Faculty;
  room?: Room;
}

// Day names for display
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

// Time slots for timetable (8 AM to 5 PM)
export const TIME_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

// Course type labels with descriptions
export const COURSE_TYPE_INFO: Record<CourseType, { label: string; description: string }> = {
  MAJOR: { label: 'Major', description: 'Core discipline courses' },
  MINOR: { label: 'Minor', description: 'Secondary discipline courses' },
  SEC: { label: 'SEC', description: 'Skill Enhancement Courses' },
  AEC: { label: 'AEC', description: 'Ability Enhancement Courses' },
  VAC: { label: 'VAC', description: 'Value Added Courses' },
};

// Helper to format time
export const formatTime = (hour: number): string => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${suffix}`;
};
