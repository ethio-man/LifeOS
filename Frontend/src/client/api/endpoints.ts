import { apiClient } from "./client";
import type {
  Activity,
  CreateActivity,
  Skill,
  CreateSkill,
  Project,
  CreateProject,
  Job,
  CreateJob,
  AppConfig,
} from "../../shared/types";

// Auth
export const authApi = {
  login: (password: string) =>
    apiClient.post<{ token: string }>("/auth/login", { password }),
};

// Activities
export const activityApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<Activity[]>("/activities", { params }),
  create: (data: CreateActivity) =>
    apiClient.post<Activity>("/activities", data),
  update: (id: string, data: Partial<Activity>) =>
    apiClient.put<Activity>(`/activities/${id}`, data),
  delete: (id: string) => apiClient.delete(`/activities/${id}`),
};

// Skills
export const skillApi = {
  list: (status?: string) =>
    apiClient.get<Skill[]>("/skills", { params: status ? { status } : {} }),
  create: (data: CreateSkill) => apiClient.post<Skill>("/skills", data),
  update: (id: string, data: Partial<Skill>) =>
    apiClient.put<Skill>(`/skills/${id}`, data),
  delete: (id: string) => apiClient.delete(`/skills/${id}`),
};

// Projects
export const projectApi = {
  list: (status?: string) =>
    apiClient.get<Project[]>("/projects", { params: status ? { status } : {} }),
  create: (data: CreateProject) => apiClient.post<Project>("/projects", data),
  update: (id: string, data: Partial<Project>) =>
    apiClient.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
};

// Jobs
export const jobApi = {
  list: (status?: string) =>
    apiClient.get<Job[]>("/jobs", { params: status ? { status } : {} }),
  create: (data: CreateJob) => apiClient.post<Job>("/jobs", data),
  update: (id: string, data: Partial<Job>) =>
    apiClient.put<Job>(`/jobs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/jobs/${id}`),
};

// Config
export const configApi = {
  get: () => apiClient.get<AppConfig>("/config"),
  update: (data: Partial<AppConfig>) =>
    apiClient.put<AppConfig>("/config", data),
};
