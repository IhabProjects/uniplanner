export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  yearLevel: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
  major: string;
  courses: Record<string, Course>;
  activities: Record<string, Activity>;
}

export interface Course {
  name: string;
  code: string;
  professor: string;
  location?: string;
  schedule?: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string;
    endTime: string;
  }[];
}

export interface Activity {
  name: string;
  type: 'Club' | 'Sport' | 'Study Group' | 'Work' | 'Other';
  location?: string;
  schedule?: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string;
    endTime: string;
  }[];
}
