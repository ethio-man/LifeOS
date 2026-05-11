import { create } from 'zustand';
import type { Activity, Skill, Project, Job, AppConfig } from '../../shared/types';
import { activityApi, skillApi, projectApi, jobApi, configApi } from '../api';

interface Store {
  // Auth
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;

  // Config
  config: AppConfig | null;
  fetchConfig: () => Promise<void>;
  updateConfig: (data: Partial<AppConfig>) => Promise<void>;

  // Activities
  activities: Activity[];
  fetchActivities: (params?: Record<string, string>) => Promise<void>;
  createActivity: (data: Omit<Activity, 'id' | 'createdAt'>) => Promise<void>;
  updateActivity: (id: string, data: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;

  // Skills
  skills: Skill[];
  fetchSkills: (status?: string) => Promise<void>;
  createSkill: (data: Omit<Skill, 'id' | 'createdAt'>) => Promise<void>;
  updateSkill: (id: string, data: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  // Projects
  projects: Project[];
  fetchProjects: (status?: string) => Promise<void>;
  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Jobs
  jobs: Job[];
  fetchJobs: (status?: string) => Promise<void>;
  createJob: (data: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  updateJob: (id: string, data: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  // Auth
  token: localStorage.getItem('lifeos_token'),
  isAuthenticated: !!localStorage.getItem('lifeos_token'),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('lifeos_token', token);
    } else {
      localStorage.removeItem('lifeos_token');
    }
    set({ token, isAuthenticated: !!token });
  },

  // Config
  config: null,
  fetchConfig: async () => {
    const { data } = await configApi.get();
    set({ config: data });
  },
  updateConfig: async (updates) => {
    const { data } = await configApi.update(updates);
    set({ config: data });
  },

  // Activities
  activities: [],
  fetchActivities: async (params) => {
    const { data } = await activityApi.list(params);
    set({ activities: data });
  },
  createActivity: async (activity) => {
    const { data } = await activityApi.create(activity);
    set((s) => ({ activities: [data, ...s.activities] }));
  },
  updateActivity: async (id, updates) => {
    const { data } = await activityApi.update(id, updates);
    set((s) => ({ activities: s.activities.map((a) => (a.id === id ? data : a)) }));
  },
  deleteActivity: async (id) => {
    await activityApi.delete(id);
    set((s) => ({ activities: s.activities.filter((a) => a.id !== id) }));
  },

  // Skills
  skills: [],
  fetchSkills: async (status) => {
    const { data } = await skillApi.list(status);
    set({ skills: data });
  },
  createSkill: async (skill) => {
    const { data } = await skillApi.create(skill);
    set((s) => ({ skills: [data, ...s.skills] }));
  },
  updateSkill: async (id, updates) => {
    const { data } = await skillApi.update(id, updates);
    set((s) => ({ skills: s.skills.map((sk) => (sk.id === id ? data : sk)) }));
  },
  deleteSkill: async (id) => {
    await skillApi.delete(id);
    set((s) => ({ skills: s.skills.filter((sk) => sk.id !== id) }));
  },

  // Projects
  projects: [],
  fetchProjects: async (status) => {
    const { data } = await projectApi.list(status);
    set({ projects: data });
  },
  createProject: async (project) => {
    const { data } = await projectApi.create(project);
    set((s) => ({ projects: [data, ...s.projects] }));
  },
  updateProject: async (id, updates) => {
    const { data } = await projectApi.update(id, updates);
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? data : p)) }));
  },
  deleteProject: async (id) => {
    await projectApi.delete(id);
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },

  // Jobs
  jobs: [],
  fetchJobs: async (status) => {
    const { data } = await jobApi.list(status);
    set({ jobs: data });
  },
  createJob: async (job) => {
    const { data } = await jobApi.create(job);
    set((s) => ({ jobs: [data, ...s.jobs] }));
  },
  updateJob: async (id, updates) => {
    const { data } = await jobApi.update(id, updates);
    set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? data : j)) }));
  },
  deleteJob: async (id) => {
    await jobApi.delete(id);
    set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) }));
  },
}));
