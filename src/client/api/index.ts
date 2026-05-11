import api from './client';
import type { Activity, CreateActivity, Skill, CreateSkill, Project, CreateProject, Job, CreateJob, AppConfig } from '../../shared/types';

// Auth
export const authApi = {
  login: (password: string) => api.post<{ token: string }>('/auth/login', { password }),
};

// Activities
export const activityApi = {
  list: (params?: Record<string, string>) => api.get<Activity[]>('/activities', { params }),
  create: (data: CreateActivity) => api.post<Activity>('/activities', data),
  update: (id: string, data: Partial<Activity>) => api.put<Activity>(`/activities/${id}`, data),
  delete: (id: string) => api.delete(`/activities/${id}`),
};

// Skills
export const skillApi = {
  list: (status?: string) => api.get<Skill[]>('/skills', { params: status ? { status } : {} }),
  create: (data: CreateSkill) => api.post<Skill>('/skills', data),
  update: (id: string, data: Partial<Skill>) => api.put<Skill>(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

// Projects
export const projectApi = {
  list: (status?: string) => api.get<Project[]>('/projects', { params: status ? { status } : {} }),
  create: (data: CreateProject) => api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Jobs
export const jobApi = {
  list: (status?: string) => api.get<Job[]>('/jobs', { params: status ? { status } : {} }),
  create: (data: CreateJob) => api.post<Job>('/jobs', data),
  update: (id: string, data: Partial<Job>) => api.put<Job>(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};

// Config
export const configApi = {
  get: () => api.get<AppConfig>('/config'),
  update: (data: Partial<AppConfig>) => api.put<AppConfig>('/config', data),
};
