-- Allow Saturday (day 5) in timetable_slots and faculty_availability
ALTER TABLE public.timetable_slots DROP CONSTRAINT IF EXISTS timetable_slots_day_of_week_check;
ALTER TABLE public.timetable_slots ADD CONSTRAINT timetable_slots_day_of_week_check CHECK (day_of_week >= 0 AND day_of_week <= 5);

ALTER TABLE public.faculty_availability DROP CONSTRAINT IF EXISTS faculty_availability_day_of_week_check;
ALTER TABLE public.faculty_availability ADD CONSTRAINT faculty_availability_day_of_week_check CHECK (day_of_week >= 0 AND day_of_week <= 5);