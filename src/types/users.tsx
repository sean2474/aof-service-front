declare module 'users' {
  interface Student {
    name: string;
    email: string;
    serviceHours: Array<ServiceHour>;
    totalHours: number;
    memorialPinStatus: string;
    hourTypes: Array<string>;
  }

  interface ServiceHour {
    id: number;
    hourName: string;
    hours: number;
    teacherEmail: string;
    hourType: number;
    status: 'Pending' | 'Confirmed' | 'Denied';
  }

  interface Teacher {
    students: Array<Student>;
    info: TeacherInfo;
    hourTypes: Array<string>;
  }

  interface TeacherInfo {
    name: string;
    lastName: string;
    fieldName: string;
    email: string;
  }
}
