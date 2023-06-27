export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRES',
  DONE = 'DONE',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
