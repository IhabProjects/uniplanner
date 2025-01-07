export interface User {
  id: string;
  name: string;
  email: string;
  schedule: Schedule;
  friends: string[]; // Array of user IDs
}

export interface Schedule {
  id: string;
  userId: string;
  events: Event[];
}

export interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'class' | 'activity' | 'personal';
  recurring: boolean;
  recurrencePattern?: string;
}
