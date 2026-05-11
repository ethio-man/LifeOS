export interface Activity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string | null;
  types: string[];
  importance: string;
  notes: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  status: 'acquired' | 'planned' | 'heard';
  category: string;
  level: '' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  source: string;
  notes: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'in-progress' | 'completed' | 'planned';
  desc: string;
  startDate: string | null;
  endDate: string | null;
  skills: string[];
  url: string;
  progress: number;
  notes: string;
  createdAt: string;
}

export interface Job {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'ghosted' | 'withdrawn';
  appliedDate: string;
  location: string;
  url: string;
  rejection: string;
  notes: string;
  createdAt: string;
}

export interface AppConfig {
  id: string;
  activityTypes: string[];
  importanceLevels: string[];
}

export type CreateActivity = Omit<Activity, 'id' | 'createdAt'>;
export type CreateSkill = Omit<Skill, 'id' | 'createdAt'>;
export type CreateProject = Omit<Project, 'id' | 'createdAt'>;
export type CreateJob = Omit<Job, 'id' | 'createdAt'>;
