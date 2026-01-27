import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Building2, BookOpen, Users, DoorOpen, GraduationCap, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { useDepartments, useCourses, useFaculty, useRooms, useStudents, useTimetableSlots } from '@/hooks/useData';
import { Link } from 'react-router-dom';
import { COURSE_TYPE_INFO } from '@/types/database';

const Dashboard = () => {
  const { data: departments = [] } = useDepartments();
  const { data: courses = [] } = useCourses();
  const { data: faculty = [] } = useFaculty();
  const { data: rooms = [] } = useRooms();
  const { data: students = [] } = useStudents();
  const { data: timetableSlots = [] } = useTimetableSlots();

  // Calculate course type distribution
  const courseByType = courses.reduce((acc, course) => {
    acc[course.course_type] = (acc[course.course_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout title="Dashboard" subtitle="NEP 2020 Adaptive Timetable System">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl p-8 text-primary-foreground" style={{ background: 'var(--gradient-hero)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold mb-2">
              AI-Based Adaptive Timetable Scheduling
            </h2>
            <p className="text-primary-foreground/80 max-w-xl">
              Aligned with NEP 2020 for multidisciplinary education. Generate conflict-free 
              timetables supporting Major/Minor courses, SEC, AEC, and VAC.
            </p>
            <Link to="/timetable">
              <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Timetable
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="hidden lg:block">
            <Calendar className="h-32 w-32 text-primary-foreground/20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Departments"
          value={departments.length}
          icon={Building2}
          subtitle="Academic units"
        />
        <StatCard
          title="Courses"
          value={courses.length}
          icon={BookOpen}
          subtitle="All types"
        />
        <StatCard
          title="Faculty"
          value={faculty.length}
          icon={Users}
          subtitle="Teaching staff"
        />
        <StatCard
          title="Rooms"
          value={rooms.length}
          icon={DoorOpen}
          subtitle={`${rooms.filter(r => r.is_lab).length} labs`}
        />
        <StatCard
          title="Students"
          value={students.length}
          icon={GraduationCap}
          subtitle="Enrolled"
        />
      </div>

      {/* Course Type Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NEP 2020 Course Distribution */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">NEP 2020 Course Distribution</h3>
          <div className="space-y-3">
            {Object.entries(COURSE_TYPE_INFO).map(([type, info]) => {
              const count = courseByType[type] || 0;
              const percentage = courses.length > 0 ? (count / courses.length) * 100 : 0;
              return (
                <div key={type} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full course-${type.toLowerCase()}`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{info.label}</span>
                      <span className="text-muted-foreground">{count} courses</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full course-${type.toLowerCase()} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * SEC: Skill Enhancement, AEC: Ability Enhancement, VAC: Value Added Courses
          </p>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Quick Setup Guide</h3>
          <div className="space-y-3">
            <Link to="/departments" className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="font-bold">1</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Add Departments</p>
                <p className="text-sm text-muted-foreground">Define academic departments</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link to="/courses" className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="font-bold">2</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Add Courses</p>
                <p className="text-sm text-muted-foreground">Major, Minor, SEC, AEC, VAC</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link to="/faculty" className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="font-bold">3</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Add Faculty & Assign Courses</p>
                <p className="text-sm text-muted-foreground">Set availability & workload</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link to="/rooms" className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="font-bold">4</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Add Rooms & Labs</p>
                <p className="text-sm text-muted-foreground">Classrooms and laboratories</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link to="/timetable" className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                <span className="font-bold">5</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Generate Timetable</p>
                <p className="text-sm text-muted-foreground">Run the scheduling algorithm</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      {/* Timetable Status */}
      {timetableSlots.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-success">Timetable Generated</p>
              <p className="text-sm text-muted-foreground">
                {timetableSlots.length} slots scheduled. 
                <Link to="/timetable" className="ml-1 text-primary hover:underline">View timetable →</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
